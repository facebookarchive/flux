# Examples

This directory contains examples that should help get you started with Flux.
They are listed in the order you should complete them.

## [./flux-concepts](./flux-concepts) - Basic concepts (no code)

These are the important high-level concepts and principles you should know
about when writing applications that use Flux.

## [./flux-todomvc](./flux-todomvc) - Start coding here

This example is where you should start. It walks you through creating the
classic [TodoMVC](http://todomvc.com/) application using a simple Flux
implementation.

## [./flux-jest](./flux-jest) - Unit Testing Stores

Being able to unit test stores is critical. This example shows you how to write
tests for the TodoMVC stores we created in an earlier example.

## [./flux-flow](./flux-flow) - Static typing

This is a very simple example that highlights how to set up Flux and
[Flow](https://flowtype.org/) in the same project. Flow is a static-type
checking tool that will help catch errors in your code statically. It
complements Flux well since it supports refining the action based on a
type string.

## [./flux-logging](./flux-logging) - Add logging to Flux apps

Taking advantage of the fact that a store gets every action makes it easy to
add logging to a Flux application. Check out this quick example where we add
a logger store to the TodoMVC app we created in an earlier example.

## [./flux-jest-container](./flux-jest-container) - Unit Testing Containers

Testing the container logic that connects stores to views can be tricky. This
example shows you how to create some utilities to help mock out store data in
order to write these kinds of tests effectively.

## [./flux-async](./flux-async) - Flux with async requests

This is an advanced example. It pulls a lot of the concepts from previous
examples into a single application. This implements TodoMVC where the data
is persisted and requested through a simple server. The server simulates
delays and errors. In the example we will handle things like optimistic
updates, loading states, and failing API requests.
