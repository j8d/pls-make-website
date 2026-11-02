# pls-make-website

> Machine,
> Pls make website,
> all responsive like, w/ BIG pictures ooo, use my fav fonts, also fancy menus with whooosh on, load fast pls
> Thanks, Human. PS no bugs :)

A one-page static site that treats every line of the r/ProgrammerHumor letter as a real requirement. Design rules and tokens are in [`DESIGN.md`](DESIGN.md), and asset licenses are in [`ASSETS.md`](ASSETS.md).

## Run it

```sh
npm install
npm run assets        # rasterize art to AVIF/WebP, copy self-hosted fonts (outputs are committed)
npm run serve         # http://localhost:4173
npm run check         # in another terminal: screenshots + interaction checks + axe (needs `npx playwright install chromium`)
```

`site/` is the whole website: plain HTML, CSS and one small deferred JS file. No build step is needed to serve it.
