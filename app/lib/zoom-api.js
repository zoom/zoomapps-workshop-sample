import axios from 'axios';
import { URL } from 'url';
import crypto from 'crypto';

const ZOOM_HOST = process.env.ZOOM_HOST || 'https://zoom.us';
const ZOOM_API_HOST = process.env.ZOOM_API_HOST || 'https://api.zoom.us';

/**
 * Get a base64 encoded URL
 * @param {string} str
 * @returns {string}
 */
function base64URL(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Get a random string of format and depth
 * @param {string} fmt
 * @param {number} depth
 * @returns {string} random string of format and depth
 */
function rand (fmt, depth = 32) {
    return crypto.randomBytes(depth).toString(fmt);
}

/**
 * Generic function for getting access or refresh tokens
 * @param {string} [id=''] - Username for Basic Auth
 * @param {string} [secret=''] - Password for Basic Auth
 * @param {Object} params - Request parameters (form-urlencoded)
 */
function tokenRequest(params, id = '', secret = '') {
    const username = id || process.env.ZOOM_CLIENT_ID;
    const password = secret || process.env.ZOOM_CLIENT_SECRET;

    return axios({
        data: new URLSearchParams(params).toString(),
        baseURL: ZOOM_HOST,
        url: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username,
            password,
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * Generic function for making requests to the Zoom API
 * @param {string} method - Request method
 * @param {string | URL} endpoint - Zoom API Endpoint
 * @param {string} token - Access Token
 * @param {object} [data=null] - Request data
 */
function apiRequest(method, endpoint, token, data = null) {
    return axios({
        data,
        method,
        baseURL: ZOOM_API_HOST,
        url: `/v2${endpoint}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * Return the url, state and verifier for the Zoom App Install
 * @return {{verifier: string, state: string, url: module:url.URL}}
 */
export function getInstallURL() {
    const state = rand('base64');
    const verifier = rand('ascii');

    const digest = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .toString();

    const challenge = base64URL(digest);

    const url = new URL('/oauth/authorize', ZOOM_HOST);

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.ZOOM_CLIENT_ID);
    url.searchParams.set('redirect_uri', process.env.ZOOM_REDIRECT_URL);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('state', state);

    return { url, state, verifier };
}

/**
 * Obtains an OAuth access token from Zoom
 * @param {string} code - Authorization code from user authorization
 * @param verifier - code_verifier for PKCE
 * @return {Promise}  Promise resolving to the access token object
 */
export async function getToken(code, verifier) {
    return tokenRequest({
        code,
        code_verifier: verifier,
        redirect_uri: process.env.ZOOM_REDIRECT_URL,
        grant_type: 'authorization_code',
    });
}

/**
 * Obtain a new Access Token from a Zoom Refresh Token
 * @param {string} token - Refresh token to use
 * @return {Promise<void>}
 */
export async function refreshToken(token) {
    return tokenRequest({
        refresh_token: token,
        grant_type: 'refresh_token',
    });
}

/**
 * Use the Zoom API to get a Zoom User
 * @param {string} uid - User ID to query on
 * @param {string} token Zoom App Access Token
 */
export function getZoomUser(uid, token) {
    return apiRequest('GET', `/users/${uid}`, token);
}

/**
 * Return the DeepLink for opening Zoom
 * @param {string} token - Zoom App Access Token
 * @return {Promise}
 */
export function getDeeplink(token) {
    return apiRequest('POST', '/zoomapp/deeplink', token, {})
        .then((data) => Promise.resolve(data.deeplink));
}