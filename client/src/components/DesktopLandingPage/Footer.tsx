export default function Footer() {
  return (
    <>
      <footer id="Contact" className="bg-[#494343] rounded-t-4xl pt-29 pb-10">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/icons/noto--money-bag.svg"
                alt="TaskMasterAI Logo"
                className="h-10 w-10"
              />
              <div>
                <span className="text-xl font-bold text-white font-(family-name:--font-IBMPlexMono)">
                  Schedgy
                </span>
                <p className="mt-1 text-sm font-(family-name:--font-IBMPlexSans) text-gray-300">
                  All in one platform to manage your finances and schedule
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold font-(family-name:--font-IBMPlexSans) text-white">
                Info
              </h3>
              <ul className="space-y-2 font-(family-name:--font-IBMPlexSans)">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Report bugs
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-gray-300 hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Traman2/Schedgy" target="_blank" className="text-gray-300 hover:text-white">
                    Github Repository
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold font-(family-name:--font-IBMPlexSans) text-white">
                Legal
              </h3>
              <ul className="space-y-2 font-(family-name:--font-IBMPlexSans)">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-300 pt-8 text-center">
            <p className="text-sm text-gray-300">
              &copy; 2025 Schedgy. All rights reserved.
            </p>
            <p className="text-sm text-gray-300">
              Built with React and Express
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
