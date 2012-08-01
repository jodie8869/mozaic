srcdir = src/
jsdir = ${srcdir}js/
cssdir = ${srcdir}css/

jsmodules = \
	${jsdir}mozaic.js \
	${jsdir}point.js

mozaic.min.js: ${jsmodules}
	java -jar yuicompressor-2.4.7.jar -o $@ $^

mozaic.max.js: ${jsmodules}
	cat > $@ $^

clean:
	rm -f mozaic.min.js mozaic.js