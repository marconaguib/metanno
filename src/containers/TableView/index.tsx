import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import TableComponent from "../../components/TableComponent";
import Toolbar from "../../components/Toolbar";
import Loading from "../../components/Loading";
import cachedReconcile from "../../utils";
import {TableData, TableMethods, ToolbarMethods} from "../../types";

const TableView = ({
     id,
     className,

     onKeyPress,
     onClickCellContent,
     onSelectedCellChange,
     registerActions,
     onFiltersChange,
     onSelectedRowsChange,
     onMouseEnterRow,
     onMouseLeaveRow,
     onButtonPress,
     onCellChange,
     onInputChange,
     selectEditorState,
 }: {
    id: string;
    className?: string,
    selectEditorState: (state: object, id: string) => TableData;
} & TableMethods & ToolbarMethods) => {
    const {
        rows,
        rowKey,
        columns,
        buttons,
        loading,
        inputValue,
        filters,
        suggestions,
        selectedRows,
        highlightedRows,
    } = useSelector(useCallback(cachedReconcile(
        state => {
            let derived = null;
            if (selectEditorState && state) {
                derived = selectEditorState(state, id)
            }

            return (derived
                ? {
                    rows: [],
                    columns: [],
                    rowKey: '',
                    buttons: [],
                    selectedCells: [],
                    styles: [],
                    filters: {},
                    suggestions: [],
                    selectedRows: [],
                    highlightedRows: [],
                    inputValue: undefined,

                    ...derived, loading: false
                }
                : {loading: true})
        }),
        [id, selectEditorState],
    ));

    if (loading) {
        return (
            <div className={"container is-loading"}>
                <Loading/>
            </div>);
    }
    return (
        <div className={`container ${buttons.length > 0 ? "has-toolbar" : ''} ${className}`}>
            {buttons.length > 0
                ? <Toolbar
                    buttons={buttons}
                    onButtonPress={idx => onButtonPress(idx)}/>
                : null}

            <TableComponent
                id={id}
                rows={rows}
                selectedRows={selectedRows}
                highlightedRows={highlightedRows}
                columns={columns}
                filters={filters}
                rowKey={rowKey}
                inputValue={inputValue}
                suggestions={suggestions}

                onKeyPress={onKeyPress}
                onMouseEnterRow={onMouseEnterRow}
                onMouseLeaveRow={onMouseLeaveRow}
                onFiltersChange={onFiltersChange}
                onSelectedRowsChange={onSelectedRowsChange}
                onSelectedCellChange={onSelectedCellChange}
                onClickCellContent={onClickCellContent}
                onCellChange={onCellChange}
                onInputChange={onInputChange}
                registerActions={registerActions}
            />
        </div>
    )
};

export default TableView;