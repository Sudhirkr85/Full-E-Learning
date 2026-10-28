const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../content/updates-fixed');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const forbiddenStrings = [
  "35 प्रश्न",
  "35/35/20",
  "नकारात्मक",
  "negative",
  "सागर सर",
  "Sagar Sir",
  "बेसिक शिक्षा परिषद्",
  "education.gov.in/scholarships-education-loan-4"
];

const whitelistedEmails = [
  'helpdesk@nsp.gov.in',
  'helpdesk-pfms@gov.in'
];

const whitelistedPhones = [
  '0120-6619540',
  '1800 118 111',
  '1800118111',
  '1800-118-111'
];

const forbiddenDomains = ['gmail.com', 'yahoo.com', 'rediffmail.com'];

console.log('--- PHASE 0 VERIFICATION RUNNING ---');
const reports = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // 1. Forbidden strings
    forbiddenStrings.forEach(str => {
      // Case-insensitive check if latin
      const lowerLine = line.toLowerCase();
      const lowerStr = str.toLowerCase();
      if (lowerLine.includes(lowerStr)) {
        reports.push({
          check: 'Forbidden String',
          file,
          line: lineNum,
          match: str,
          context: line.trim().substring(0, 100)
        });
      }
    });

    // 2. Links that do not start with https://
    // Look for markdown links [text](url) or "url": "..." or raw http://
    // Regex for href or url:
    const linkMatches = line.match(/(https?:\/\/[^\s"'<>\)\\]+)/gi) || [];
    linkMatches.forEach(url => {
      if (!url.startsWith('https://')) {
        reports.push({
          check: 'Non-HTTPS Link',
          file,
          line: lineNum,
          match: url,
          context: line.trim().substring(0, 100)
        });
      }
    });

    // Also look for un-prefixed links like http: or ftp:
    const insecureSchemeMatches = line.match(/\b(http:\/\/|ftp:\/\/)[^\s"'<>\)\\]+/gi) || [];
    insecureSchemeMatches.forEach(url => {
      reports.push({
        check: 'Insecure URL Scheme',
        file,
        line: lineNum,
        match: url,
        context: line.trim().substring(0, 100)
      });
    });

    // 3. Emails other than whitelisted
    const emailMatches = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi) || [];
    emailMatches.forEach(email => {
      const lowerEmail = email.toLowerCase();
      if (!whitelistedEmails.includes(lowerEmail)) {
        reports.push({
          check: 'Non-Whitelisted Email',
          file,
          line: lineNum,
          match: email,
          context: line.trim().substring(0, 100)
        });
      }
      if (forbiddenDomains.some(d => lowerEmail.includes(d))) {
        reports.push({
          check: 'Webmail (Gmail/Yahoo/Rediffmail)',
          file,
          line: lineNum,
          match: email,
          context: line.trim().substring(0, 100)
        });
      }
    });

    // 4. Phone numbers other than whitelisted
    // Matches 10 digit numbers, STD codes like 0120-..., toll free 1800...
    // Be careful with false positives like dates (2026-10-28), marks percentages (40%), years (2026-27), numbers like 350000, 100000, 12000
    // Standard phone patterns:
    // Toll free: 1800...
    // Landline: 0\d{2,4}[-\s]?\d{6,8}
    // Mobile: [6-9]\d{9}
    const tollFree = line.match(/1800[-\s]?\d{3}[-\s]?\d{3}/g) || [];
    tollFree.forEach(p => {
      const norm = p.replace(/[\s-]/g, '');
      if (norm !== '1800118111') {
        reports.push({
          check: 'Non-Whitelisted Toll-Free Phone',
          file,
          line: lineNum,
          match: p,
          context: line.trim().substring(0, 100)
        });
      }
    });

    const landline = line.match(/0\d{2,4}[-\s]\d{6,8}/g) || [];
    landline.forEach(p => {
      const norm = p.replace(/[\s]/g, '-');
      if (norm !== '0120-6619540') {
        reports.push({
          check: 'Non-Whitelisted Landline Phone',
          file,
          line: lineNum,
          match: p,
          context: line.trim().substring(0, 100)
        });
      }
    });

    const mobile = line.match(/\b[6-9]\d{9}\b/g) || [];
    mobile.forEach(p => {
      reports.push({
        check: 'Non-Whitelisted Mobile Phone Candidate',
        file,
        line: lineNum,
        match: p,
        context: line.trim().substring(0, 100)
      });
    });
  });
});

console.log('Total matches found:', reports.length);
console.log(JSON.stringify(reports, null, 2));
