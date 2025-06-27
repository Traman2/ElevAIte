export default function Features() {
  return (
    <>
      <section className="w-full bg-[#fff] px-0 p-20 rounded-4xl relative z-10 overflow-x-hidden">
        <div className="max-w-[1100px] mx-auto px-8">
          <div id="features" className="mt-110">
            <div className="text-center mb-8">
              <span className="text-base font-bold tracking-widest text-[#C2B280] font-(family-name:--font-IBMPlexSans)">
                Features
              </span>
            </div>
            <h2 className="text-5xl font-bold font-(family-name:--font-IBMPlexSans) text-black text-center mb-16 max-w-[600px] mx-auto">
              Schedgy has Everything You Need in One Place
            </h2>
            <div className="bg-[#f1ede2] rounded-3xl p-10 shadow-md">
              <div className="flex items-center justify-between gap-8 mb-14">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold font-(family-name:--font-IBMPlexSans) max-w-[400px] text-[#5C543C] mb-4">
                    All in one panel
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#6B6B6B]">
                    Juggling Notion, Excel, Mint, Google Calendar, and countless
                    other tools to manage your academic life? Simplify your
                    journey with Schedgy—your all-in-one platform for seamless
                    organization, smarter budgeting, and stress-free student
                    living.
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-end">
                  <div className="light-cream-box">
                    <img
                      src="/landingAssets/overview.png"
                      alt="Overview"
                      className="w-[450px] h-[300px] rounded-2xl shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-12 mb-14">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    Map of all transactions
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#6B6B6B]">
                    Visualize your spending on an interactive map and know where
                    you spend the most so you can cut down on wasteful spending
                    and keep more in your pockets
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-start">
                  <div className="light-pink-box">
                    <img
                      src="/landingAssets/transactions.png"
                      alt="Overview"
                      className="w-[540px] h-[304px] rounded-2xl shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-16 mb-14">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    School Updates
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#6B6B6B]">
                    Also get notified when you have an upcoming presentation or test and when you'll get your next paycheck all in one tab
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-end">
                  <div className="light-yellow-box">
                    <img
                      src="/landingAssets/addTransaction.png"
                      alt="Overview"
                      className="w-[510px] h-[300px] rounded-2xl shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
                    Internship Manager
                  </h2>
                  <p className="text-base font-medium font-(family-name:--font-IBMPlexSans) text-[#6B6B6B]">
                    Visualize your spending on an interactive map and Know when
                    you're getting paid and update your balance instantly
                  </p>
                </div>
                <div className="flex-shrink-0 flex justify-start">
                  <div className="light-blue-box">
                    <img
                      src="/landingAssets/internship.png"
                      alt="Overview"
                      className="w-[420px] h-[300px] rounded-2xl shadow-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
