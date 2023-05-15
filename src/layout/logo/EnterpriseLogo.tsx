import { useStateGui } from "../../StateGui";

const [, { getDisplayedMenu }] = useStateGui();

export default function () {
  return (
    <svg
      class="logo"
      viewBox="0 0 726 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_39_820)">
        <g
          id="enterprise-logo-text"
          classList={{ block: getDisplayedMenu(), hidden: !getDisplayedMenu() }}
          class="title fill-white"
        >
          <path d="M254.73 5.07581C247.936 5.01164 242.255 4.98145 237.684 4.98145C234 4.98145 230.256 5.49102 226.447 6.50639C222.639 7.52177 219.143 9.23922 215.973 11.6474C212.798 14.0594 210.258 17.3622 208.355 21.552C206.449 25.7419 205.498 30.9509 205.498 37.1714V145.93H233.687V91.8356L289.495 90.3106V68.0252L233.687 66.5003V42.5012C233.687 39.0739 234.668 36.3108 236.639 34.2159C238.605 32.121 241.557 31.0754 245.494 31.0754H298.633V7.4576C291.518 6.6989 284.123 6.12516 276.442 5.74392C268.761 5.36268 261.521 5.14375 254.73 5.07581V5.07581Z" />
          <path d="M348.058 122.689C346.469 121.674 345.295 120.054 344.533 117.831C343.77 115.611 343.389 112.592 343.389 108.783V0.598633H315.2V112.977C315.2 120.722 316.344 127.041 318.628 131.929C320.915 136.817 324.437 140.437 329.2 142.789C333.964 145.14 339.962 146.311 347.198 146.311H361.866V125.931L354.056 124.788C351.644 124.406 349.644 123.712 348.058 122.693V122.689Z" />
          <path d="M440.053 45.3585C434.022 43.3277 426.752 42.3086 418.244 42.3086C408.973 42.3086 401.069 42.8823 394.528 44.0223C387.986 45.166 382.241 46.4984 377.293 48.0234V64.4052H407.958C414.307 64.4052 419.033 64.8809 422.147 65.8321C425.257 66.7833 427.386 68.3082 428.529 70.4031C429.673 72.498 430.243 75.1365 430.243 78.3072V85.3544H404.149C392.595 85.3544 384.083 87.8645 378.629 92.8773C373.167 97.8937 370.438 104.277 370.438 112.018V121.161C370.438 129.287 372.85 135.636 377.674 140.207C382.498 144.778 388.783 147.066 396.528 147.066C400.718 147.066 404.749 146.62 408.622 145.733C412.495 144.846 415.986 143.733 419.097 142.4C422.207 141.068 424.842 139.766 427.001 138.497C429.16 137.229 430.681 136.085 431.572 135.07L436.143 145.926H458.428V76.4086C458.428 67.6477 456.873 60.7892 453.763 55.8368C450.649 50.8845 446.078 47.393 440.05 45.3623L440.053 45.3585ZM430.243 122.497C429.986 122.625 429.386 122.878 428.435 123.259C427.484 123.64 426.276 124.056 424.815 124.497C423.354 124.943 421.765 125.388 420.052 125.83C418.338 126.275 416.685 126.656 415.099 126.973C413.51 127.291 412.083 127.449 410.815 127.449C408.528 127.449 406.463 127.102 404.625 126.403C402.783 125.705 401.322 124.531 400.242 122.882C399.163 121.232 398.623 119.137 398.623 116.597V112.407C398.623 108.727 399.797 105.805 402.149 103.646C404.496 101.487 408.147 100.219 413.099 99.8377L430.239 98.6939V122.501L430.243 122.497Z" />
          <path d="M541.666 43.6445L521.393 75.9817L498.809 43.6445H470.432L505.015 93.3035L470.432 145.929H499.002L519.275 113.781L541.666 145.929H570.236L535.635 96.3798L570.236 43.6445H541.666Z" />
          <path d="M607.756 2.12389H586.045C583.38 2.12389 582.043 3.45633 582.043 6.12499V24.7905C582.043 27.3346 583.376 28.5991 586.045 28.5991H607.756C610.168 28.5991 611.376 27.3308 611.376 24.7905V6.12122C611.376 4.97751 611.059 4.0263 610.425 3.26383C609.787 2.50135 608.904 2.12012 607.76 2.12012L607.756 2.12389Z" />
          <path d="M610.802 43.6445H582.613V145.926H610.802V43.6445Z" />
          <path d="M721.655 64.8805C719.24 57.0708 715.401 51.3296 710.131 47.6456C704.858 43.9615 697.845 42.1233 689.084 42.1233C684.385 42.1233 679.497 43.0141 674.42 44.7882C669.339 46.566 664.768 48.5326 660.707 50.6917V0.598633H632.518V145.929H656.135L660.707 136.213C663.243 138.12 665.946 139.897 668.799 141.547C671.657 143.2 674.861 144.533 678.417 145.548C681.969 146.563 685.97 147.069 690.417 147.069C698.419 147.069 704.987 145.197 710.131 141.453C715.272 137.708 719.085 132.024 721.557 124.403C724.033 116.785 725.271 107.262 725.271 95.8324C725.271 83.01 724.064 72.6902 721.652 64.8805H721.655ZM694.893 112.403C693.432 116.721 691.398 119.737 688.797 121.451C686.193 123.164 683.241 124.021 679.942 124.021C675.752 124.021 672.098 123.516 668.992 122.496C665.878 121.481 663.115 120.337 660.707 119.069V70.5009C663.243 69.1043 666.134 67.8058 669.373 66.598C672.612 65.3939 676.133 64.7899 679.946 64.7899C682.992 64.7899 685.815 65.458 688.42 66.7905C691.021 68.1229 693.115 70.8557 694.705 74.9814C696.29 79.1108 697.086 85.6183 697.086 94.5038C697.086 102.121 696.354 108.092 694.897 112.407L694.893 112.403Z" />
        </g>
        <g id="enterprise-logo" class="icon fill-green">
          <path d="M97.8872 2.32715C94.9279 7.08318 93.218 12.6809 93.218 18.6864C93.218 23.4613 94.2975 27.9833 96.2301 32.0334H78.5686C51.8368 32.0334 30.1666 53.7036 30.1666 80.4355V92.786C25.3049 89.6229 19.526 87.796 13.3167 87.796C8.73431 87.796 4.38595 88.7887 0.464111 90.5854V80.3864C0.464111 37.2764 35.4134 2.32715 78.5196 2.32715H97.8872Z" />
          <path d="M27.4188 118.88C27.4188 119.031 27.4188 119.19 27.4075 119.341C27.1508 126.935 20.6056 132.96 12.8299 132.356C5.65431 131.797 0.0603118 125.437 0.392479 118.246C0.449098 117 0.675576 115.804 1.04926 114.672C2.82334 109.274 7.91908 105.363 13.9019 105.363C21.3492 105.363 27.4188 111.422 27.4188 118.88Z" />
          <path d="M137.815 18.9964C137.653 26.1455 131.7 32.0755 124.555 32.2113C121.981 32.2604 119.546 31.581 117.478 30.3655C113.469 28.0026 110.778 23.6543 110.778 18.6869C110.778 13.7194 113.469 9.37108 117.478 7.01949C119.474 5.84558 121.815 5.16992 124.295 5.16992C131.855 5.16992 137.989 11.3981 137.819 18.9964H137.815Z" />
          <path d="M144.866 56.1611V85.8637H92.6708C87.8242 85.8637 83.8986 89.7893 83.8986 94.6359V146.831H54.196V81.3568C54.196 67.4435 65.4746 56.1611 79.3917 56.1611H144.87H144.866Z" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_39_820">
          <rect
            width="724.898"
            height="146.471"
            fill="white"
            transform="translate(0.377441 0.598633)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
