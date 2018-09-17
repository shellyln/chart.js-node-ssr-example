# Chart.js server side rendering example on the node.js environment.

Render various charts using Chart.js into the SVG format.

Chart.js uses the HTML5 Canvas API.  
However, the node.js environment does not have the Canvas API by default.  
With [red-agate-svg-canvas](https://www.npmjs.com/package/red-agate-svg-canvas),
you can render the charts on the server side.


## Get started

```bash
$ git clone https://github.com/shellyln/chart.js-node-ssr-example.git
$ cd chart.js-node-ssr-example
$ rm -rf ./.git

$ npm install
$ npm run build
$ npm start
```


## Example

```ts
import { SvgCanvas,
         Rect2D,
         SvgCanvas2DGradient } from 'red-agate-svg-canvas/modules';
import * as ChartJs            from 'chart.js';

// Get the global scope.
// If running on a node, "g" points to a "global" object.
// When running on the browser, "g" points to the "window" object.
const g = Function('return this')();

// Chart options
// https://www.chartjs.org/docs/latest/getting-started/usage.html
const opts: any = { ... };


function main() {
    // SvgCanvas has a "CanvasRenderingContext2D"-compatible interface.
    const ctx = new SvgCanvas();

    // SvgCanvas lacks the canvas property.
    (ctx as any).canvas = {
        width: 800,
        height: 400,
        style: {
            width: '800px',
            height: '400px',
        },
    };

    // SvgCanvas does not have font glyph information,
    // so manually set the ratio of (font height / font width).
    ctx.fontHeightRatio = 2;

    // Chart.js needs a "HTMLCanvasElement"-like interface that has "getContext()" method.
    // "getContext()" should returns a "CanvasRenderingContext2D"-compatible interface.
    const el = { getContext: () => ctx };

    // If "devicePixelRatio" is not set, Chart.js get the devicePixelRatio from "window" object.
    // node.js environment has no window object.
    opts.options.devicePixelRatio = 1;

    // Disable animations.
    opts.options.animation = false;
    opts.options.events = [];
    opts.options.responsive = false;

    // Chart.js needs the "CanvasGradient" in the global scope.
    const savedGradient = g.CanvasGradient;
    g.CanvasGradient = SvgCanvas2DGradient;
    try {
        const chart = new ChartJs.Chart(el as any, opts);
    } finally {
        if (savedGradient) {
            g.CanvasGradient = savedGradient;
        }
    }

    // Render as SVG.
    const svgString = ctx.render(new Rect2D(0, 0 , 800, 400), 'px');
    console.log(svgString);
}
```


## Notes

To import the [red-agate-svg-canvas](https://www.npmjs.com/package/red-agate-svg-canvas), you need to use `babel` + `webpack`.
