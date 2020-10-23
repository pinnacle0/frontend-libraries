# Awesome Readme Image

This is a useless project to test out new react jsx transform with babel and parcel.

# Usage

None.

But on serious note, it can be used to test if parcel can run correctly after upgrading to yarn 2.

> If yarn 2 fails to dedupe parcel peer dependencies as virtual packages then parcel will throw an error of "Name already registered with serializer".  
> Running `$ yarn why @parcel/fs` would indicates that there are multiple copies of the package `@parcel/fs` of same version installed (as [virtual packages][yarnpkg-doc-virtual-packages]).  
> If in the future nothing breaks after upgrading to yarn 2, just ignore this :)

[yarnpkg-doc-virtual-packages]: https://yarnpkg.com/advanced/lexicon#virtual-package
