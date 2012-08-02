srcdir = src/
jsdir = ${srcdir}js/
cssdir = ${srcdir}css/

jsmodules = \
	${jsdir}point.js\
	${jsdir}kdtree.js\
	${jsdir}mozaic.js
	
all: mozaic.max.js mozaic.min.js

mozaic.max.js: ${jsmodules}
	cat > $@ $^

mozaic.min.js:
	java -jar yuicompressor-2.4.7.jar -o $@ mozaic.max.js

clean:
	rm -f mozaic.min.js mozaic.js
