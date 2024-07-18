class YouTubeVideo {
  static iframe = (videoId: string) => /* html */ `
    <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  `;

  elWrapper: Element;
  elInit: Element;

  constructor(el: Element, videoId: string) {
    this.elWrapper = el;

    const initEl = el.querySelector("[data-js-yt-init]");
    if (!initEl) {
      throw new Error("No init element found");
    }
    this.elInit = initEl;

    this.elInit.addEventListener("click", () => {
      this.elWrapper.innerHTML = YouTubeVideo.iframe(videoId);
    });
  }

  static init() {
    const wrappers = document.querySelectorAll("[data-js-yt-video-id]");

    wrappers.forEach((wrapper) => {
      const videoId = wrapper.getAttribute("data-js-yt-video-id");

      if (!videoId) {
        console.error("No video ID provided for element", wrapper);
        return;
      }

      try {
        new YouTubeVideo(wrapper, videoId);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

globalThis.YouTubeVideo = YouTubeVideo;

export default YouTubeVideo;
