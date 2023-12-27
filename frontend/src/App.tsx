import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js"

import HeroTextContentComponent from "./components/hero_text_content.component"
import ImageContainerComponent from "./components/image_container.component"
import LeftFooterComponent from "./components/left_footer.component"
import NavIconsComponent from "./components/nav_icons.component"
import NavLinksComponent from "./components/nav_links.component"
import PageCountComponent from "./components/page_count.component"
import RightFooterComponent from "./components/right_footer.component"

function App() {
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="w-screen h-screen font-alata flex">
        <div className="h-full w-[50%] flex-1 flex flex-col justify-between pl-40 pr-24 pb-8">
          <NavLinksComponent />
          <HeroTextContentComponent />
          <LeftFooterComponent />
        </div>
        <div className="relative h-full w-[50%] flex-1 bg-[#fff0c8] pr-40 pb-8 flex flex-col justify-between">
          <NavIconsComponent />
          <ImageContainerComponent />
          <PageCountComponent />
          <RightFooterComponent />
        </div>
      </div>
    </PayPalScriptProvider>
  )
}

export default App
