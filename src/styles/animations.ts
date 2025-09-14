import { keyframes } from "styled-components";

export const animations = {
  floatingSkew: keyframes`
        0%{
            transform:  translateY(0px);
        }
        50%{
            transform:  translateY(-10px) skew(2deg);
        }
        100%{
            transform:  translateY(0px);
        }
`,
  slideDown: keyframes`
    from{
        opacity: 0%;
        height: 0;
    }
    to{
        opacity: 100%;
        height: 100vh;
    }
`,

  showDown: keyframes`
        0%{
            opacity: 0;
            transform:  translateY(-200%);
        }
        50%{
            opacity: 30%;
            transform:  translateY(0);
        }
        100%{
            opacity: 100%;
            transform:  translateY(0);
        }
`,

  flip: keyframes`
        0%{
            opacity: 0;
            transform:  rotate(0deg)
            scale(0);
        }
        100%{
            opacity: 100%;
            transform:  rotate(1080deg)
                        scale(100%);
        }
`,

  pulse: (color: string, maxSize = 1.1) => keyframes`
    0% {
      transform: scale(0.9);
      filter: drop-shadow(0 0 5px ${color});
    }

    50% {
      transform: scale(${maxSize});
      filter: drop-shadow(0 0 70px rgba(0, 0, 0, 0));
    }

    100% {
      transform: scale(0.9);
      filter: drop-shadow(0 0 5px ${color});
    }
  `,
};
