import { GithubLogo } from "./logos";

export default function Header() {
    return (
        <header className="fixed px-4 top-6 z-30 w-full">
            <div className="navbar  rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#get-started">Get started</a></li>
                            <li><a href="#example">Example</a></li>

                        </ul>
                    </div>
                    <a href='https://scifr.fordelab.com/' className="btn btn-ghost text-xl">SCIFR</a>
                </div>
                <div className="navbar-end">
                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#get-started">Get started</a></li>
                            <li><a href="#example">Example</a></li>
                        </ul>
                    </div>
                    <button className="btn btn-square btn-ghost">
                        <a href="https://github.com/nalarbp/create-scifr" target="_blank" rel="noreferrer"><GithubLogo size={50} /></a>
                    </button>
                </div>
            </div>
        </header>
    );
}
