# UniTalk | React Test Task

**Stack:** React 18, TypeScript, Vite, Redux Toolkit, React Query, MUI, styled-components

## How to run

```bash
npm i
npm start
```

Implemented features

MUI table according to the provided design

Data fetched from:

GET /operator

GET /operatorAddon

Dynamic columns generated from operatorAddon.fieldName

Cell value = operatorAddon.text

Sorting, filtering (by name, status, date range), and pagination (5/10/25/50)

“Working” status displayed as a read-only checkbox

Responsive and polished UI using MUI + styled-components

Time

Estimated: ~4 hours

Actual: ~3,5 hours

Notes

operatorAddon has no relation field to operator,
so columns are merged by fieldName → text.
If the API included operatorId, adapting the mapping logic would be trivial.
