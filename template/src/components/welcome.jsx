export default function Welcome() {
    return (
        <div id='home' className="relative pt-36 px-8 pb-8 ml-auto bg-gradient-to-r from-purple-400/20 via-blue-500/20 to-purple-60/20">
            <div className="lg:w-2/3 xl:w-1/2 text-center mx-auto pb-8">
                <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-5xl xl:text-5xl ">
                    <span className="text-primary dark:text-white">SCIFR: </span>
                    Developing your {" "}
                    <span className="bg-primary text-white">single file interactive report </span>
                    starts here
                </h1>
                <p className="mt-8 text-gray-700 dark:text-gray-300 text-lg">
                    Congratulations!. Your scifr development enviroment is ready. Use this as the boilerplate, modify it, add more components, change input data, states, and build it for your template report.
                </p>
                <div className="px-8 mt-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
                    <a
                        href="#get-started"
                        className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                    >
                        <span className="relative text-base font-semibold text-white">Get started</span>
                    </a>
                    <a
                        href="#example"
                        className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                    >
                        <span className="relative text-base font-semibold text-primary dark:text-white">See example</span>
                    </a>
                </div>
            </div>
        </div>
    );
}