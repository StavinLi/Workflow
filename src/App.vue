<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "app"
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    margin-top: 60px;
}
a,
abbr,
acronym,
address,
applet,
article,
aside,
audio,
b,
big,
blockquote,
body,
canvas,
caption,
center,
cite,
code,
dd,
del,
details,
dfn,
div,
dl,
dt,
em,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
html,
i,
iframe,
img,
ins,
kbd,
label,
legend,
li,
mark,
menu,
nav,
object,
ol,
p,
pre,
q,
s,
samp,
section,
small,
span,
strike,
strong,
sub,
summary,
sup,
table,
tbody,
td,
tfoot,
th,
thead,
time,
tr,
tt,
u,
ul,
var,
video {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
.clear:before,
.clear:after {
    content: " ";
    display: table;
}
.clear:after {
    clear: both;
}
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.l {
    float: left;
}
input {
    text-indent: 10px;
}
select {
    text-indent: 8px;
}
.ml_10 {
    margin-left: 10px;
}
.mr_10 {
    margin-right: 10px;
}
.radio_box a,
.check_box a {
    font-size: 12px;
    position: relative;
    padding-left: 20px;
    margin-right: 30px;
    cursor: pointer;
    color: #333;
    white-space: pre;
}
.check_box.not a:hover {
    color: #333;
}
.check_box.not a::before,
.check_box.not a:hover::before {
    border: none;
}
.check_box.not.active {
    background: #f3f3f3;
}
.radio_box a:hover::before,
.check_box a:hover::before {
    border: 1px solid #46a6fe;
}
.radio_box a::before,
.check_box a::before {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    left: 0;
    top: 1px;
    content: "";
}
.radio_box a::before {
    border-radius: 50%;
}
.check-dot.active::after,
.radio_box a.active::after,
.check_box a.active::after {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    content: "";
}
.radio_box a.active::after {
    background: #46a6fe;
}
.check_box a.active::after {
    background: url(~@/assets/images/check_box.png) no-repeat center;
}
</style>
