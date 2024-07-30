import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Plus Jakarta Sans", sans-serif;
    scroll-behavior: smooth;
}
.input-container input{
    font-size: 16px;
    font-weight: 500
}

.input-container select{
    font-size: 16px;
    font-weight: 500
}
`