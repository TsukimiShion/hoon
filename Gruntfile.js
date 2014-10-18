module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            install: {
                options: {
                    targetDir: "./lib",
                    layout: "byComponent",
                    install: true,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                },
            },
        },
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: "build/hoon.min.map",
                },
                files: {
                    "build/hoon.min.js": "src/hoon.js",
                },
            },
        },
        mocha: {
            test: {
                src: ["test/index.html"],
            },
        },
        simplemocha: {
            options: {
                globals: ["chai"],
                timeout: 3000,
                ui: "tdd",
                reporter: "tap",
            },

            all: { src: ["test/test.js"] }
        },
        jshint: {
            all: ["Gruntfile.js", "src/hoon.js", "test/test.js"],
            options: {
                jshintrc: true,
            },
        },
        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "<%= pkg.homepage %>",
                options: {
                    paths: "src",
                    outdir: "yuidoc"
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-simple-mocha");
    grunt.registerTask("test", ["mocha", "simplemocha"]);
};
