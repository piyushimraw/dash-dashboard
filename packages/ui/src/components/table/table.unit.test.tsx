import { render, screen } from "@testing-library/react"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"

describe("Table components", () => {
  it("renders Table with children and custom class", () => {
    render(
      <Table className="custom-table">
        <tbody>
          <tr>
            <td>Cell</td>
          </tr>
        </tbody>
      </Table>
    )

    const table = screen.getByRole("table")
    expect(table).toBeInTheDocument()
    expect(table).toHaveClass("custom-table")
    expect(table).toHaveAttribute("data-slot", "table")
  })

  it("renders TableHeader correctly", () => {
    render(
      <table>
        <TableHeader className="header-class">
          <tr>
            <th>Header</th>
          </tr>
        </TableHeader>
      </table>
    )

    const thead = screen.getByText("Header").closest("thead")
    expect(thead).toBeInTheDocument()
    expect(thead).toHaveClass("header-class")
    expect(thead).toHaveAttribute("data-slot", "table-header")
  })

  it("renders TableBody correctly", () => {
    render(
      <table>
        <TableBody className="body-class">
          <tr>
            <td>Body Cell</td>
          </tr>
        </TableBody>
      </table>
    )

    const tbody = screen.getByText("Body Cell").closest("tbody")
    expect(tbody).toBeInTheDocument()
    expect(tbody).toHaveClass("body-class")
    expect(tbody).toHaveAttribute("data-slot", "table-body")
  })

  it("renders TableFooter correctly", () => {
    render(
      <table>
        <TableFooter className="footer-class">
          <tr>
            <td>Footer</td>
          </tr>
        </TableFooter>
      </table>
    )

    const tfoot = screen.getByText("Footer").closest("tfoot")
    expect(tfoot).toBeInTheDocument()
    expect(tfoot).toHaveClass("footer-class")
    expect(tfoot).toHaveAttribute("data-slot", "table-footer")
  })

  it("renders TableRow correctly", () => {
    render(
      <table>
        <tbody>
          <TableRow className="row-class">
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    )

    const row = screen.getByText("Row").closest("tr")
    expect(row).toBeInTheDocument()
    expect(row).toHaveClass("row-class")
    expect(row).toHaveAttribute("data-slot", "table-row")
  })

  it("renders TableHead correctly", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead className="head-class">Head</TableHead>
          </tr>
        </thead>
      </table>
    )

    const th = screen.getByText("Head")
    expect(th).toBeInTheDocument()
    expect(th.tagName).toBe("TH")
    expect(th).toHaveClass("head-class")
    expect(th).toHaveAttribute("data-slot", "table-head")
  })

  it("renders TableCell correctly", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="cell-class">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    )

    const td = screen.getByText("Cell")
    expect(td).toBeInTheDocument()
    expect(td.tagName).toBe("TD")
    expect(td).toHaveClass("cell-class")
    expect(td).toHaveAttribute("data-slot", "table-cell")
  })

  it("renders TableCaption correctly", () => {
    render(
      <Table>
        <TableCaption className="caption-class">
          Caption text
        </TableCaption>
      </Table>
    )

    const caption = screen.getByText("Caption text")
    expect(caption).toBeInTheDocument()
    expect(caption.tagName).toBe("CAPTION")
    expect(caption).toHaveClass("caption-class")
    expect(caption).toHaveAttribute("data-slot", "table-caption")
  })
})
