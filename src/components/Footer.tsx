import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="w-full bg-gray-50 dark:bg-gray-900">
      <hr className="w-full mx-auto border-gray-200 dark:border-gray-700" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2 flex items-start">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <LogoIcon />
            ShopNest
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Follow Us</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Github
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Twitter
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Dribbble
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Platforms</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Web
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Mobile
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Desktop
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">About</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Features
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Pricing
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              FAQ
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="/vendor-landing"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Become a Vendor
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Community</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Youtube
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Discord
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
            >
              Twitch
            </a>
          </div>
        </div>
      </section>

      <section className="container py-8 flex justify-center items-center">
        <div className="w-full max-w-[100vw] md:max-w-[728px] h-[320px] overflow-hidden">
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5940376050748645"
            data-ad-slot="9198368596"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3 className="text-gray-600 dark:text-gray-400">
          © 2025 ShopNest developed by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/leopoldo-miranda/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Udhay
          </a>
        </h3>
      </section>

      <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
    </footer>
  );
};