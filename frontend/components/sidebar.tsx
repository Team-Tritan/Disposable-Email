import Link from "next/link";
import useUser from "@store/useUser";
import {
  InboxIcon,
  AtSymbolIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";

interface Props {
  deleteMailbox: () => void;
}

const Sidebar: React.FC<Props> = ({ deleteMailbox }) => {
  // Get global state from the store so we don't have to pass it to each component
  const { creating, setShowCompose, setShowSent } = useUser();

  return (
    <div className="w-64 bg-[#0d0c0e] text-white flex flex-col justify-between border border-zinc-800">
      <div className="bg-[#0d0c0e] p-4 rounded-xl">
        <div className="text-lg font-semibold mb-1 mt-1 pb-4 text-center text-white border-b border-zinc-800">
          <Link href="https://mailbox.tritan.gg">Tritan Disposable Mail</Link>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={deleteMailbox}
          className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#18181f] hover:bg-[#1c1c24] border border-zinc-800 rounded-lg shadow-lg"
          disabled={creating}
        >
          <SparklesIcon className="h-4 mr-2 text-yellow-400" /> New Address
        </button>

        <button
          onClick={() => setShowCompose(true)}
          className="text-white w-full py-3 px-6 text-sm font-semibold flex items-center justify-center bg-[#18181f] hover:bg-[#1c1c24] border border-zinc-800 rounded-lg shadow-lg mt-3"
          disabled={creating}
        >
          <PencilSquareIcon className="h-4 mr-2" /> Compose Email
        </button>
      </div>

      <div className="p-4 text-center">
        <div
          className="flex items-center justify-center py-1 border border-zinc-800 rounded-lg shadow-lg"
          onClick={() => setShowSent(false)}
          style={{ cursor: "pointer" }}
        >
          <AtSymbolIcon className="h-4 mr-2" />
          Inbox
        </div>
        <div
          className="flex items-center justify-center py-1 border border-zinc-800 rounded-lg shadow-lg mt-3"
          onClick={() => setShowSent(true)}
          style={{ cursor: "pointer" }}
        >
          <InboxIcon className="h-4 mr-2" /> Sent
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-xs text-gray-300 underline mb-2 px-2">
          <Link href="https://tritan.gg/legal">TOS & Privacy Policy</Link>
        </div>
        <div className="text-xs text-gray-300 underline mb-2 px-2">
          <Link href="https://tritan.gg/contact/new-request?type=abuse_report">
            Report Abuse
          </Link>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-300 mt-6 mb-2 px-2">
          <div>Created by Tritan Internet LLC</div>
          <a
            href="https://github.com/Team-Tritan/Disposable-Mail"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-6 w-6 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0,0,300,150"
              style={{ fill: "#FFFFFF" }}
            >
              <g
                fill="#ffffff"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <g transform="scale(4,4)">
                  <path d="M32,6c-14.359,0 -26,11.641 -26,26c0,12.277 8.512,22.56 19.955,25.286c-0.592,-0.141 -1.179,-0.299 -1.755,-0.479v-5.957c0,0 -0.975,0.325 -2.275,0.325c-3.637,0 -5.148,-3.245 -5.525,-4.875c-0.229,-0.993 -0.827,-1.934 -1.469,-2.509c-0.767,-0.684 -1.126,-0.686 -1.131,-0.92c-0.01,-0.491 0.658,-0.471 0.975,-0.471c1.625,0 2.857,1.729 3.429,2.623c1.417,2.207 2.938,2.577 3.721,2.577c0.975,0 1.817,-0.146 2.397,-0.426c0.268,-1.888 1.108,-3.57 2.478,-4.774c-6.097,-1.219 -10.4,-4.716 -10.4,-10.4c0,-2.928 1.175,-5.619 3.133,-7.792c-0.2,-0.567 -0.533,-1.714 -0.533,-3.583c0,-1.235 0.086,-2.751 0.65,-4.225c0,0 3.708,0.026 7.205,3.338c1.614,-0.47 3.341,-0.738 5.145,-0.738c1.804,0 3.531,0.268 5.145,0.738c3.497,-3.312 7.205,-3.338 7.205,-3.338c0.567,1.474 0.65,2.99 0.65,4.225c0,2.015 -0.268,3.19 -0.432,3.697c1.898,2.153 3.032,4.802 3.032,7.678c0,5.684 -4.303,9.181 -10.4,10.4c1.628,1.43 2.6,3.513 2.6,5.85v8.557c-0.576,0.181 -1.162,0.338 -1.755,0.479c11.443,-2.726 19.955,-13.009 19.955,-25.286c0,-14.359 -11.641,-26 -26,-26zM33.813,57.93c-0.599,0.042 -1.203,0.07 -1.813,0.07c0.61,0 1.213,-0.029 1.813,-0.07zM37.786,57.346c-1.164,0.265 -2.357,0.451 -3.575,0.554c1.218,-0.103 2.411,-0.29 3.575,-0.554zM32,58c-0.61,0 -1.214,-0.028 -1.813,-0.07c0.6,0.041 1.203,0.07 1.813,0.07zM29.788,57.9c-1.217,-0.103 -2.411,-0.289 -3.574,-0.554c1.164,0.264 2.357,0.451 3.574,0.554z"></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
