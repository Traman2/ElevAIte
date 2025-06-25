export default function Features() {
    return(
        <>
        <section className="w-full bg-[#fff] px-0 p-20 rounded-4xl relative z-10 overflow-x-hidden">
          <div className="max-w-[1000px] mx-auto px-8">
            <div id="features" className="mt-110">
              <h2 className="text-3xl font-bold font-(family-name:--font-IBMPlexSans) text-black text-center mb-20 max-w-[400px] mx-auto">
                Schedgy has Everything You Need in One Place
              </h2>
              <div className="flex items-center justify-between gap-8 mb-24">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-(family-name:--font-IBMPlexSans) max-w-[400px] text-[#5C543C] mb-4">
                    Expense Tracker
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) max-w-[380px] text-[#5C543C]">
                    Visualize your spending on an interactive map and Know when
                    you're getting paid and update your balance instantly
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-end">
                  <img
                    src="/landingAssets/overview.png"
                    alt="Overview"
                    className="w-[450px] h-[300px] rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-12 mb-24">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    Feature 2
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#5C543C]">
                    Visualize your spending on an interactive map and Know when
                    you're getting paid and update your balance instantly
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-start">
                  <img
                    src="/landingAssets/transactions.png"
                    alt="Overview"
                    className="w-[540px] h-[304px] rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-16 mb-24">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    Feature 3
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#5C543C]">
                    Visualize your spending on an interactive map and Know when
                    you're getting paid and update your balance instantly
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-end">
                  <img
                    src="/landingAssets/addTransaction.png"
                    alt="Overview"
                    className="w-[510px] h-[300px] rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    Feature 4
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#5C543C]">
                    Visualize your spending on an interactive map and Know when
                    you're getting paid and update your balance instantly
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-start">
                  <img
                    src="/landingAssets/overview.png"
                    alt="Overview"
                    className="w-[450px] h-[300px] rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
    )
}