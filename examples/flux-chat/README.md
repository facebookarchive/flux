## Flux Chat Example

This is an example application we've created to show an example of how a Flux
app is structured, and how you might use waitFor to make sure the Stores'
registered callbacks are called in the correct order.

## Running

You must have [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

`npm install`

This will install all dependencies.

To build the project, first run this command:

`npm start`

This will perform an initial build and start a watcher process that will
update build.js with any changes you wish to make.  This watcher is
based on [Browserify](http://browserify.org/) and
[Watchify](https://github.com/substack/watchify), and it transforms
React's JSX syntax into standard JavaScript with
[Reactify](https://github.com/andreypopp/reactify).

## License

> Copyright 2013-2014 Facebook, Inc.
>
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
