import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import imagick from "lume/plugins/imagick.ts";
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import postcss_minify from "postcss-minify";
import postcss_extend_rule from "postcss-extend-rule";
import source_maps from "lume/plugins/source_maps.ts";
import esbuild from "lume/plugins/esbuild.ts";

const site = lume({
  src: "./src",
});

site.copy("static", ".");

site.use(date());
site.use(imagick());

site.helper("img", (path: string) => /* html */ `
<picture>
	<source srcset="
		/images/${path}-500w.webp 500w,
		/images/${path}-1000x.webp 1000w,
		/images/${path}-2000x.webp 2000w,
		/images/${path}-2500x.webp 2500w,
		/images/${path}-4000x.webp 4000w" type="image/webp">
	<source srcset="
		/images/${path}-500w.png 500w,
		/images/${path}-1000x.png 1000w,
		/images/${path}-2000x.png 2000w,
		/images/${path}-2500x.png 2500w,
		/images/${path}-4000x.png 4000w" type="image/png">

	<img srcset="/images/${path}-500w.png 500w,
		/images/${path}-1000x.png 1000w,
		/images/${path}-2000x.png 2000w,
		/images/${path}-2500x.png 2500w,
		/images/${path}-4000x.png 4000w" src="/images/${path}-1000x.png" alt="${path}">
</picture>
`, { type: "tag" });

site.use(sass());
site.use(postcss({
  keepDefaultPlugins: true,
  plugins: [
    postcss_extend_rule(),
    postcss_minify(),
  ],
}));
site.use(esbuild());

site.use(source_maps());

export default site;
