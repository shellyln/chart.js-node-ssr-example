// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SvgCanvas,
         Rect2D,
         SvgCanvas2DGradient,
         Point2D,
         TransferMatrix2D } from 'red-agate-svg-canvas/modules';
import * as ChartJs from 'chart.js';



// Get the global scope.
// If running on a node, "g" points to a "global" object.
// When running on the browser, "g" points to the "window" object.

// tslint:disable-next-line:function-constructor
const g = Function('return this')();



// Chart options
// https://www.chartjs.org/docs/latest/getting-started/usage.html
const opts: any = {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                linear: true,
            },
            y: {
                linear: true,
                beginAtZero: true,
            },
        }
    }
};
/*
// https://www.chartjs.org/docs/latest/samples/bar/stacked.html
const opts: any  = {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [50, 20, 30, 80, 90, 19, 35],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Dataset 2',
                data: [90, 19, 35, 50, 20, 30, 80],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'Dataset 3',
                data: [19, 35, 50, 20, 30, 80, 90],
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
            },
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked'
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        }
    }
};
*/



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
        (ctx as any).resetTransform = function () {
            // TODO: shellyln/red-agate/packages/red-agate-svg-canvas/src/drawing/canvas/SvgCanvas.ts
            (this as any).currentPointOnCtm = null;
            (this as any).ctm = new TransferMatrix2D();
        };
        ChartJs.Chart.register(...ChartJs.registerables);
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


main();
