export default `[
    {
        "id": "routes/one.two.three",
        "file": "routes/one.two.three.tsx",
        "path": "one/two/three",
        "index": false,
        "children": []
    },
    {
        "id": "routes/demos/params",
        "file": "routes/demos/params.tsx",
        "path": "demos/params",
        "index": false,
        "children": [
            {
                "id": "routes/demos/params/index",
                "file": "routes/demos/params/index.tsx",
                "path": "",
                "index": true,
                "children": []
            },
            {
                "id": "routes/demos/params/$id",
                "file": "routes/demos/params/$id.tsx",
                "path": ":id",
                "index": false,
                "children": []
            }
        ]
    },
    {
        "id": "routes/demos/about",
        "file": "routes/demos/about.tsx",
        "path": "demos/about",
        "index": false,
        "children": [
            {
                "id": "routes/demos/about/index",
                "file": "routes/demos/about/index.tsx",
                "path": "",
                "index": true,
                "children": []
            },
            {
                "id": "routes/demos/about/whoa",
                "file": "routes/demos/about/whoa.tsx",
                "path": "whoa",
                "index": false,
                "children": []
            },
            {
                "id": "routes/demos/about/404",
                "file": "routes/demos/about/404.tsx",
                "path": "*",
                "index": false,
                "children": []
            }
        ]
    },
    {
        "id": "routes/index",
        "file": "routes/index.tsx",
        "path": "",
        "index": true,
        "children": []
    },
    {
        "id": "routes/404",
        "file": "routes/404.tsx",
        "path": "*",
        "index": false,
        "children": []
    }
]`;
