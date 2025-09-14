import { createGlobalStyle } from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";
import { colors } from "@styles/colors";
import scrollbar from "./scrollbar";
import { shapes } from "@styles/shapes";

const Globals = createGlobalStyle`

/* @font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.ttf') format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
} */
.react-phone-number-input {
  width: 1.5em;
  height: auto;
  opacity: 0;
}
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
  body {
    background-color: ${colors.background};
    
}
}
:root {
     color-scheme: light only;
}

${scrollbar(colors.elements)}

body{
  background-color: ${colors.background};
  height: 100vh;
  width: 100vw;
  display: flex;
  position: absolute;
  inset: 0;
  overflow: hidden;

  .toast{
    z-index: 999;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
  opacity: 0.1;
  background: ${shapes.background}
    }

  }

  img{
    user-select: none;
  }

  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      /* font-family: 'Inter', sans-serif; */
          font-family: 'Roboto', sans-serif;

      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      outline: none;
      user-select: none;
    }

    input, textarea{
      user-select: auto;
    }

    .no-scroll {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    min-height: 0;

    overflow: auto; /* ainda permite rolagem */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }


    @media only screen {
      .onlyprint{
        display: none!important;
      } 
    }
    @media only print {
      .noprint{
        display: none!important;
      } 
    }

    .checklistheader{

      &.sticky{
        position: sticky;
      }

    }




.highlight-scroll {
  animation: highlight-pulse 2s ease-out;
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0px 0px rgba(255, 200, 0, 0.8);
    background-color: rgba(255, 235, 100, 0.5);
  }
  50% {
    box-shadow: 0 0 15px 5px rgba(255, 200, 0, 0.6);
    background-color: rgba(255, 235, 100, 0.2);
  }
  100% {
    box-shadow: 0 0 0px 0px rgba(255, 200, 0, 0);
    background-color: transparent;
  }
}


.highlight-overlay {
  position: relative;
}

.highlight-overlay::after {
  content: "";
  position: absolute;
  inset: 0; /* cobre todo o elemento */
  background: rgba(255, 235, 100, 0.7);
  pointer-events: none; /* não bloqueia clique */
  animation: overlay-fade 2s ease-out forwards;
  border-radius: inherit; /* respeita borda arredondada */
}

@keyframes overlay-fade {
  0% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
  }
}


`;

export default Globals;
