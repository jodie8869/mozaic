srcdir = src/

jsmodules = \
	${srcdir}point.js\
	${srcdir}kdtree.js\
	${srcdir}sourcecanvas.js\
	${srcdir}tileimage.js\
	${srcdir}tiles.js\
	${srcdir}mozaiccanvas.js\
	${srcdir}mozaic.js
	
all: mozaic.max.js mozaic.min.js

mozaic.max.js: ${jsmodules}
	cat > $@ $^

mozaic.min.js:
	java -jar yuicompressor-2.4.7.jar -o $@ mozaic.max.js

clean:
	rm -f mozaic.min.js mozaic.max.js
