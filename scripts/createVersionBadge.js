const fs = require('fs');
const path = require('path');
const svg2img = require('svg2img');

const generateSvg = (value) => {
    let bgColor = '#226db7';
    let textColor = "#fff";
    let valueXPos = 94;

    return `
<svg width="145" height="25" xmlns="http://www.w3.org/2000/svg">
 <g>
  <title>Layer 1</title>
  <rect x="0" stroke="#000" rx="5" id="svg_1" height="25" width="70" y="0" stroke-width="0" fill="#5b5050"/>
  <rect rx="5" id="svg_4" height="25" width="75" y="0" x="70" stroke-width="0" stroke="#000" fill="${bgColor}"/>
  <rect y="0" stroke="#000" id="svg_2" height="25" width="20" x="65" stroke-width="0" fill="#5b5050"/>
  <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="'Gluten'" font-size="20" id="svg_6" y="18.5" x="9" stroke-width="1.5" stroke="#fff" fill="#ffffff">version</text>
  <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="'Gluten'" font-size="19" id="svg_8" y="18.5" x="${valueXPos}" stroke-width="1.5" stroke="${textColor}" fill="${textColor}">${value}</text>
 </g>
</svg>
`;
};

const loadCVersionFromPackageJson = (path) => {
    if (!fs.existsSync(path)) {
        throw new Error(`Package JSON ${path} does not exist.`);
    }
    const data = fs.readFileSync(path, 'utf-8');
    const packageJson = JSON.parse(data);
    return packageJson.version;
};

(async () => {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Please provide path to package JSON file');
        return 1;
    } else if (args.length < 2) {
        console.error('Please provide path for the output file');
        return 1;
    }

    try {
        const version = loadCVersionFromPackageJson(args[0]);
        const svgString = generateSvg(version);

        svg2img(svgString, {
            loadSystemFonts: true,
            shapeRendering: 2,
            textRendering: 1,
            imageRendering: 0,
            dpi: 20,
        }, function (error, buffer) {
            //returns a Buffer
            if (error) {
                console.error('Error converting SVG to PNG', error);
                return 1;
            }

            if (!fs.existsSync(path.join(args[1]))) {
                fs.mkdirSync(path.join(args[1]));
            }

            fs.writeFileSync(path.join(args[1], 'version_badge.png'), buffer);
            console.log('Version badge created successfully!');
        });
    } catch (e) {
        console.error(e);
        return 1;
    }
})();
