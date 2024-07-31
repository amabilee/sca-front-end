import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Plus Jakarta Sans", sans-serif;
    scroll-behavior: smooth;
}
.input-container input, .input-container select{
    font-size: 15px;
    font-weight: 500
}
`