const envsub = require('envsub')
const crypto = require('crypto')
const fs = require('fs')

const {name} = require('./package.json')

const outputFile = '.env.local';
const templateFile = `.env.example`;

const options = {
    protect: true,
    envs: [
        {
            name: '_SESSION_SECRET',
            value: crypto.randomBytes(32).toString('hex'),
        }
    ]
};

if (!fs.existsSync(outputFile))
    envsub({ templateFile, outputFile, options }).catch(e => console.error(e));