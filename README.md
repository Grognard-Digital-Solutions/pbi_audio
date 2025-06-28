# pbi audio

Simple POC audio player custom visual for Power BI

To change audio file, you must first replace `https://grognard.ca` with the root of the domain you want to fetch your audio from in the `privileges` section of the "capabilities.json" file so Power BI can access music from your website. You can then replace the value of `source.src` with the path to your file (you may need to replace `source.type` as well depending on the kind of file you are using).

You can then package using the `pbiviz package` command in the directory you cloned this project.

