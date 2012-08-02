srcdir = src/
jsdir = ${srcdir}js/
cssdir = ${srcdir}css/

jsmodules = \
	${jsdir}point.js \
	${jsdir}kdtree.js \
	${jsdir}mozaic.js
	
all: mozaic.min.js mozaic.max.js

mozaic.min.js: ${jsmodules}
	java -jar yuicompressor-2.4.7.jar -o $@ $^

mozaic.max.js: ${jsmodules}
	cat > $@ $^

clean:
	rm -f mozaic.min.js mozaic.js