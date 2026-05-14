import { GithubLogo, TwitterLogo } from "./logos";

export default function Footer() {
    return (
        <footer className="footer bg-neutral text-neutral-content items-center p-4">
            <aside className="grid-flow-col items-center">
                <p>
                    <span className="font-bold">SCIFR: Single Self-Contained Interactive File Report.</span>
                    <br />
                    Budi Permana | Forde Genomics Lab | The University of Queensland
                </p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
                    <ul className="flex gap-1">
                        <li>
                            <div
                                className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                                aria-label="Twitter"
                            >
                                <button className="btn btn-ghost btn-circle">
                                    <a href="https://twitter.com/nalarbudi" target="_blank" rel="noreferrer">
                                        <TwitterLogo size={40} />
                                    </a>
                                </button>
                            </div>
                        </li>
                        <li>
                            <div
                                className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                                href="https://github.com/nalarbp/create-scifr"
                                aria-label="Github"
                            >
                                <button className="btn btn-ghost btn-circle">
                                    <a href="https://github.com/nalarbp/create-scifr" target="_blank" rel="noreferrer">
                                        <GithubLogo size={40} />
                                    </a>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </footer>
    );
}