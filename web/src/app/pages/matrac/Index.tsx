import { SiteHeader } from "./site-header";
import Stats from "./Stats";

function Index() {
    return (
        <div className="mx-auto p-5 xl:px-0 sm:pt-0 lg:px-10">
            <div className="">
                <SiteHeader />
                < Stats />
            </div>
        </div>
    )
}

export default Index;