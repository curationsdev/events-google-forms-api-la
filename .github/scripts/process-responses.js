const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`📄 ${message}`);
}

function ensureDirectoryForFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`);
  }
}

function isBase64String(str) {
  if (!str || typeof str !== 'string') return false;
  const normalized = str.trim();
  if (!normalized) return false;
  if (/[^A-Za-z0-9+/=\r\n]/.test(normalized)) return false;
  try {
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    const reencoded = Buffer.from(decoded, 'utf8').toString('base64').replace(/=+$/, '');
    return reencoded === normalized.replace(/=+$/, '');
  } catch (error) {
    return false;
  }
}

function decodeContent(content, encoding) {
  if (!content) return '';
  if (encoding === 'base64' || isBase64String(content)) {
    try {
      return Buffer.from(content, 'base64').toString('utf8');
    } catch (error) {
      log(`Failed to decode base64 content: ${error.message}`);
      return content;
    }
  }
  return content;
}

function extractContent(entry) {
  if (entry == null) return null;
  if (typeof entry === 'string') {
    return decodeContent(entry);
  }
  if (typeof entry === 'object') {
    const encoding = entry.encoding || entry.format;
    if (entry.content) {
      return decodeContent(entry.content, encoding);
    }
    if (entry.data) {
      return decodeContent(entry.data, encoding);
    }
    if (Array.isArray(entry.lines)) {
      return entry.lines.join('\n');
    }
  }
  return null;
}

function appendRow(filePath, row) {
  const finalRow = Array.isArray(row) ? row.join(',') : row;
  const normalizedRow = finalRow.endsWith('\n') ? finalRow : `${finalRow}\n`;
  ensureDirectoryForFile(filePath);
  fs.appendFileSync(filePath, normalizedRow, 'utf8');
  log(`Appended row to ${filePath}`);
}

function writeFile(filePath, content) {
  ensureDirectoryForFile(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
  log(`Wrote file: ${filePath}`);
}

function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    console.log('No event payload found.');
    return;
  }

  const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const payload = eventData.client_payload || {};

  if (!payload || Object.keys(payload).length === 0) {
    console.log('Repository dispatch received with no client payload.');
    return;
  }

  let changes = 0;
  const masterPath = path.join(process.cwd(), 'responses', 'master-responses.csv');

  const masterCandidates = [
    payload.masterCsv,
    payload.master_csv,
    payload.master_csv_content,
    payload.master
  ];
  for (const candidate of masterCandidates) {
    const content = extractContent(candidate);
    if (content) {
      writeFile(masterPath, content);
      changes += 1;
      break;
    }
  }

  const headerValue = payload.headers || payload.header;
  if (headerValue) {
    let fileIsMissingOrEmpty = false;
    try {
      fileIsMissingOrEmpty = fs.statSync(masterPath).size === 0;
    } catch (err) {
      if (err.code === 'ENOENT') {
        fileIsMissingOrEmpty = true;
      } else {
        throw err;
      }
    }
    if (fileIsMissingOrEmpty) {
      appendRow(masterPath, headerValue);
      changes += 1;
    }
  }

  const appendRowValue = payload.appendRow || payload.append_row || payload.csvRow || payload.csv_row;
  if (appendRowValue) {
    appendRow(masterPath, appendRowValue);
    changes += 1;
  }

  const filesArray = payload.files || payload.additionalFiles || payload.fileBundle;
  if (Array.isArray(filesArray)) {
    filesArray.forEach(fileEntry => {
      if (!fileEntry) return;
      const relativePath = fileEntry.path || fileEntry.filePath || fileEntry.name;
      const content = extractContent(fileEntry);
      if (!relativePath || content == null) return;
      writeFile(path.join(process.cwd(), relativePath), content);
      changes += 1;
    });
  }

  const individual = payload.individual || payload.individualFiles;
  if (Array.isArray(individual)) {
    individual.forEach(fileEntry => {
      if (!fileEntry) return;
      const relativePath = fileEntry.path || fileEntry.filePath || fileEntry.name;
      const content = extractContent(fileEntry);
      if (!relativePath || content == null) return;
      writeFile(path.join(process.cwd(), 'responses', 'individual', relativePath), content);
      changes += 1;
    });
  }

  const daily = payload.daily || payload.dailyCsv || payload.daily_files;
  if (Array.isArray(daily)) {
    daily.forEach(fileEntry => {
      if (!fileEntry) return;
      const relativePath = fileEntry.path || fileEntry.filePath || fileEntry.name;
      const content = extractContent(fileEntry);
      if (!relativePath || content == null) return;
      writeFile(path.join(process.cwd(), 'responses', relativePath), content);
      changes += 1;
    });
  }

  if (changes === 0) {
    console.log('No response files were created or updated from the payload.');
  } else {
    log(`Updated ${changes} file(s) from repository dispatch payload.`);
  }
}

main();
