const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, '..', 'packages.html'),
    path.join(__dirname, '..', 'blood-tests.html')
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('v7-premium.css')) {
            content = content.replace('</head>', '    <link rel="stylesheet" href="./src/styles/v7-premium.css" />\n  </head>');
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        }
    }
}

const templatePath = path.join(__dirname, '..', 'scripts', 'package-template.html');
if (fs.existsSync(templatePath)) {
    let content = fs.readFileSync(templatePath, 'utf8');
    if (!content.includes('v7-premium.css')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="../src/styles/v7-premium.css" />\n  </head>');
        fs.writeFileSync(templatePath, content);
        console.log(`Updated ${templatePath}`);
    }
}
