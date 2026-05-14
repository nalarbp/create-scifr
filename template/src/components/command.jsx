export default function Command() {
    return (
        <div id="get-started" className="bg-gray-900 relative py-20  rounded-lg sm:rounded-none mx-2 sm:mx-auto px-2">
            <div className="lg:w-4/5 text-start mx-auto pb-4">
                <div className="mockup-code">
                    <pre className="text-blue-300" data-prefix="$"><code>### Develop your Scifr </code></pre>
                    <pre data-prefix="$"><code className="text-gray-500">#install scifr boilerplate</code></pre>
                    <pre data-prefix="$"><code>npx create-scifr my-awesome-scifr</code></pre>

                    <pre data-prefix="$"><code className="text-gray-500">#start the development server</code></pre>
                    <pre data-prefix="$"><code>npm run dev</code></pre>
                    <pre className="text-gray-500" data-prefix="$"><code>### Design and add more components, input data, states, etc.</code></pre>

                    <pre data-prefix="$"><code className="text-gray-500">#then build your scifr</code></pre>
                    <pre data-prefix="$"><code>npm run build</code></pre>
                    <br></br>


                </div>

            </div>
        </div>
    );
}