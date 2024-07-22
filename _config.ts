import lume from "lume/mod.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import date from "lume/plugins/date.ts";
import { de } from "date-fns/locale";
import transform_images from "lume/plugins/transform_images.ts";
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import postcss_minify from "postcss-minify";
import postcss_extend_rule from "postcss-extend-rule";
import postcss_mixin from "postcss-mixins";
import postcss_nesting from "postcss-nesting";
import postcss_each from "postcss-each";
import source_maps from "lume/plugins/source_maps.ts";
import sheets from "lume/plugins/sheets.ts";
import esbuild from "lume/plugins/esbuild.ts";
import metas from "lume/plugins/metas.ts";
import inline from "lume/plugins/inline.ts";

const site = lume({
  src: "./src",
});

site.copy("static", ".");

site.use(nunjucks());

site.use(inline());

site.use(date({
  locales: { de },
}));

site.use(transform_images());

site.use(sheets({
  options: {
    raw: true,
  },
}));

site.use(sass());
site.use(postcss({
  useDefaultPlugins: true,
  plugins: [
    postcss_each(),
    postcss_extend_rule(),
    postcss_mixin(),
    postcss_nesting(),
    postcss_minify(),
  ],
}));
site.use(esbuild());

site.use(source_maps());

site.use(metas());

// FILTERS

site.filter("to_date", (value) => new Date(value).toJSON());
site.filter("decode_utf8", (value) => decodeURIComponent(escape(value)));

site.filter("filter_old_dates", (array) => {
  const now = new Date();

  const new_array = array.filter((event: Record<string, string>) => {
    const date = new Date(event["Datum"]);

    return date >= now;
  });

  return new_array;
});

// HELPERS
const helperSrcset = (path: string) => {
  const pathParts = path.split(".");
  const extension = pathParts.pop();
  const filename = pathParts.join(".");

  return `/images/${filename}-500x.${extension} 500w,
		/images/${filename}-1000x.${extension} 1000w,
		/images/${filename}-2000x.${extension} 2000w,
		/images/${filename}-2500x.${extension} 2500w,
		/images/${filename}-4000x.${extension} 4000w`;
};
site.helper("srcset", helperSrcset, { type: "tag", async: false });

export default site;
