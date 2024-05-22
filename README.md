# Instructions

This tool can automatically rename data points in an ETC file without the need to use the program's graphical user interface (https://www.gossenmetrawatt.de/produkte/etc). To use the program, the main.js file must be executed with nodejs in a folder 
called "Kunden". This folder contains another folder with the customer name, which in turn contains an ETC file called “Rohdaten.etc” and a text file called “Messpunktnamen.txt”. The text file is structured in such a way that the new measuring point 
names come after a machine ID followed by the word “Ende” (see the attached example). After all machines have been listed, the word “Schließen” follows. It is important that each word is written in a new line and that there are no empty lines at the end. 
The machine IDs in the text file must correspond exactly to the IDs in the ETC file and the number of measuring point names must match. After starting the program, the name of the customer folder is requested and reference is made to the above remarks. 
A new ETC file named “Umbenannt.etc” is then created in the customer folder, which contains the renamed measuring point names.
