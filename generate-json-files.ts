import path = require('path');
import fs = require('fs');

const DIGIT_DIR_REGEX = /^[0-9A-Z_-]$/;

generateJsonFiles('.');

async function generateJsonFiles(rootDir: string) {
    const allCueFiles = await listAllCueFiles(rootDir);
    for (const cueFile of allCueFiles) {
        console.log('Processing ' + cueFile) // TODO
    }
}

async function listAllCueFiles(rootDir: string) {
    const allCueFiles: string[] = []

    const dirs0 = await readdirOneDigitDirs(rootDir);
    for (const digit0 of dirs0) {
        const dirs1 = await readdirOneDigitDirs(path.join(rootDir, digit0));
        for (const digit1 of dirs1) {
            const dirs2 = await readdirOneDigitDirs(path.join(rootDir, digit0, digit1));
            for (const digit2 of dirs2) {
                const dirCueFiles = await readdirCues(path.join(rootDir, digit0, digit1, digit2));
                for (const cueFile of dirCueFiles) {
                    allCueFiles.push(path.join(digit0, digit1, digit2, cueFile))
                }
            }
        }
    }

    return allCueFiles;
}

async function readdirOneDigitDirs(dir: string): Promise<string[]> {
    const all = await readdir(dir)
    return all.filter(file => DIGIT_DIR_REGEX.test(file))
}

async function readdirCues(dir: string): Promise<string[]> {
    const all = await readdir(dir)
    return all.filter(file => file.endsWith('.cue'))
}

function readdir(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err: Error, files: string[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        })
    })
}
