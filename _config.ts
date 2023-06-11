import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import de from "npm:date-fns/locale/de/index.js";
import imagick from "lume/plugins/imagick.ts";
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import postcss_minify from "postcss-minify";
import postcss_extend_rule from "postcss-extend-rule";
import postcss_mixin from "postcss-mixins";
import source_maps from "lume/plugins/source_maps.ts";
import sheets from "lume/plugins/sheets.ts";
import esbuild from "lume/plugins/esbuild.ts";
import metas from "lume/plugins/metas.ts";

const site = lume({
  src: "./src",
});

site.copy("static", ".");

site.use(date({
	locales: { de },
}));

site.use(imagick());

site.use(sheets());

site.use(sass());
site.use(postcss({
  keepDefaultPlugins: true,
  plugins: [
    postcss_extend_rule(),
		postcss_mixin(),
    postcss_minify(),
  ],
}));
site.use(esbuild());

site.use(source_maps());

site.use(metas());

site.filter("to_date", (value) => new Date(value).toJSON());
site.filter("decode_utf8", (value) => decodeURIComponent(escape(value)));

site.filter("filter_old_dates", (array) => {
	const now = new Date();

	const new_array = array.filter((event) => {
		const date = new Date(event["Datum"]);

		return date => now;
	});

	return new_array;
});


export default site;
