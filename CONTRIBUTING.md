# Contributing
Thanks for checking out Prop-Types-CSS, I hope it has helped you in developing awesome things.
If you want to help improve Prop-Types-CSS, there are a few ways in which you can help.

1. *Improving definitions*: At the core of this project is a formal definition of css properties. However, not all options have fully been described yet. Check the grammar section below for more information on how you can write new definitions.
2. *Improving the compiler*: In the end, the type-checkers can only be as good as the compiler makes them. If you want to improve performance or increase the variety of possible definitions, this might be a good start. Check the compiler section below.

## Grammar
The grammar is split into different files in the `grammar/` folder. 
A good starting point might be the `size.grmr` file, as it shows a wide variety of groups and possible definitions.
Let's start at the end of the file:

```
size
	auto
	max-content
	min-content
	<length>
	<percentage>
```

This section defines what a size can be, and will be compiled into the `isSize` and `PropTypesCss.size` functions.
The first line, as might be obvious, defines the name of this group, `size`.
The other five lines define what a size may be. There are three literal definitions and two references, a size may be the string `auto`, `max-content`, `min-content` or it may be a valid length or percentage.

Looking at the definition of a percentage, CSS defines it as a number followed by a percentage sign.
This is reflected quite clearly in the grammar.

```
percentage
	/<number>%/
```