# json-comment.js

## Why

json格式文件不支持注释，但可以在其他格式文件里写上注释再自动生成json文件，变相的支持注释。

## Installation

    $ npm install json-commenter --save-dev

## Usage


```  
Options:
      -v, --version        output the version number
      -w --watch [value]   watch（是否实时监测文件变化）
      -f --file <value>    url of entry（入口文件地址或文件夹）
      -t --to [value]      url of output（输出文件夹地址，默认当前文件夹'./'）
      -e --ext [value]     extension of file being watched（被检测的文件后缀，默认为'.jc'）
      -h, --help           output usage information
```


## Example

监听./data.jc文件，并生成./data.json文件

```data.jc

//data.jc
{
    //name
    name: 'Alex',
    //age
    age: 16
}
//data.json文件
{
    "name": "Alex",
    "age": 16
}
```

```bash
jsonc --watch --file ./data.jc
```

## License

MIT
