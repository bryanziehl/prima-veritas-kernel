# Invariants Module

This directory defines the non-negotiable rules enforced by the Prima Veritas Kernel.

These rules are declarative.
They do not contain logic.
They are consumed by kernel stages but never interpreted creatively.

## Purpose

The invariants module exists to:

- Enforce ordering constraints
- Enforce immutability guarantees
- Define explicit rejection conditions
- Prevent silent failure or interpretive behavior

## Design Principles

- Invariants are explicit
- Violations produce errors, not warnings
- Ambiguity is preserved, not resolved
- Silence is forbidden

## What This Module Does NOT Do

- Does not infer intent
- Does not repair data
- Does not override kernel stages
- Does not introduce heuristics

## Rule Files

- `ordering.rules.json` — legal ordering constraints
- `immutability.rules.json` — immutability guarantees
- `rejection.rules.json` — explicit failure conditions

Any change to these files is a **breaking change**.
