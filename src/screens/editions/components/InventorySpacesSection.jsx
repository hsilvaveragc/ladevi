import React from "react";
import { FieldArray } from "formik";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import InputTextField from "shared/components/InputTextField";
import InputSelectField from "shared/components/InputSelectField";
import InputMultiSelectField from "shared/components/InputMultiSelectField";
import FormFieldset from "shared/components/FormFieldset";

const InventoryContainer = styled.div`
  margin-bottom: 2rem;

  .drag-drop-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .available-spaces {
      width: 100%;

      h5 {
        margin-bottom: 1rem;
        color: #495057;
        font-weight: 600;
        font-size: 1rem;
      }

      .spaces-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
        border: 2px dashed #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
    }

    .drop-zones {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .drop-zone {
        border: 2px solid #007bff;
        border-radius: 8px;
        min-height: 100px;
        padding: 0.75rem;
        background-color: #f8f9fa;

        .zone-header {
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
          text-align: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dee2e6;
          font-size: 0.95rem;
        }

        .cards-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-height: 50px;

          &.drag-over {
            background-color: #e3f2fd;
            border: 2px dashed #2196f3;
            border-radius: 4px;
            padding: 0.25rem;
          }
        }
      }

      .tapa {
        border-color: #dc3545;
        .zone-header {
          color: #dc3545;
        }
      }

      .interior {
        border-color: #28a745;
        .zone-header {
          color: #28a745;
        }
      }

      .contratapa {
        border-color: #ffc107;
        .zone-header {
          color: #856404;
        }
      }
    }
  }

  .space-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem;
    cursor: grab;
    user-select: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 150px;
    height: 60px;
    position: relative;

    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &.dragging {
      opacity: 0.5;
      cursor: grabbing;
      transform: rotate(2deg);
    }

    .drag-handle {
      color: #666;
      cursor: grab;
      font-size: 0.7rem;
      flex-shrink: 0;

      &:hover {
        color: #333;
      }
    }

    .space-name {
      font-size: 0.75rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
      line-height: 1.2;
    }

    .quantity-badge {
      background: #007bff;
      color: white;
      border-radius: 8px;
      padding: 0.15rem 0.4rem;
      font-size: 0.65rem;
      flex-shrink: 0;
      font-weight: 600;
    }

    .label-inputs {
      font-size: 0.75rem;
      overflow: hidden;
      white-space: nowrap;
      min-width: 0;
      line-height: 1.2;
    }
  }

  /* Cards en zonas tienen diferentes dimensiones y controles */
  .drop-zone .space-card {
    width: 100%;
    height: auto;
    min-height: 45px;
    flex-wrap: wrap;

    .page-location-select {
      margin-left: auto;
      margin-right: 0.3rem;
      min-width: 80px;

      .form-group {
        margin-bottom: 0;
      }

      select {
        font-size: 0.7rem;
        padding: 0.2rem 0.15rem;
        height: auto;
        border-radius: 4px;
      }
    }

    .page-selection-container {
      margin-left: auto;
      margin-right: 0.3rem;
      min-width: 100px;

      .form-group {
        margin-bottom: 0;
      }

      button {
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        height: auto;
      }
    }
  }

  /* Tooltip styling */
  .space-card[title] .space-name {
    cursor: help;

    &:hover {
      color: #0056b3;
    }
  }

  /* Estado de arrastre para toda la zona */
  .drag-over {
    animation: dragPulse 0.6s ease-in-out infinite alternate;
  }

  @keyframes dragPulse {
    from {
      background-color: #e3f2fd;
    }
    to {
      background-color: #bbdefb;
    }
  }
`;

const InventorySpacesSection = ({
  formikProps,
  deleteMode,
  getProductAdvertisingSpaces,
  generateInteriorPageOptions,
  handlePageLocationChange,
  handleAllPagesChange,
  handleDragStart,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
}) => {
  return (
    <InventoryContainer>
      <FormFieldset title="Inventario de tipos de espacios">
        <FieldArray
          name="inventoryProductAdvertisingSpaces"
          render={() => {
            const currentProductAdvertisingSpaces = getProductAdvertisingSpaces(
              formikProps.values.productId
            );

            if (currentProductAdvertisingSpaces.length === 0) {
              return (
                <div className="alert alert-info">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-info"
                    style={{ fontSize: "1.25rem" }}
                  />{" "}
                  Seleccione un producto para configurar el inventario de sus
                  tipos de espacios
                </div>
              );
            }

            // Espacios que ya están asignados a alguna zona
            const assignedSpaceIds = formikProps.values.inventoryProductAdvertisingSpaces
              .filter(item => item.zone && item.zone !== null)
              .map(item => item.productAdvertisingSpaceId);

            // Espacios disponibles para arrastrar
            const availableSpaces = currentProductAdvertisingSpaces.filter(
              space => !assignedSpaceIds.includes(space.id)
            );

            return (
              <div className="drag-drop-container">
                {/* Espacios disponibles */}
                <div className="available-spaces">
                  <h5>Tipos de Espacio Disponibles</h5>
                  <div className="spaces-grid">
                    {availableSpaces.map(space => (
                      <div
                        key={space.id}
                        className="space-card"
                        draggable
                        title={space.name.length > 12 ? space.name : undefined}
                        onDragStart={e => handleDragStart(e, space)}
                      >
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="drag-handle"
                        />
                        <span className="space-name">{space.name}</span>
                      </div>
                    ))}
                    {availableSpaces.length === 0 && (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          textAlign: "center",
                          color: "#6c757d",
                          fontSize: "0.9rem",
                          padding: "1rem",
                        }}
                      >
                        Todos los tipos de espacio han sido asignados
                      </div>
                    )}
                  </div>
                </div>

                {/* Zonas de destino */}
                <div className="drop-zones">
                  {["tapa", "interior", "contratapa"].map(zone => {
                    const zoneSpaces = formikProps.values.inventoryProductAdvertisingSpaces
                      .filter(item => item.zone === zone)
                      .sort((a, b) => a.order - b.order)
                      .map(item => {
                        const space = currentProductAdvertisingSpaces.find(
                          s => s.id === item.productAdvertisingSpaceId
                        );
                        return { ...space, quantity: item.quantity };
                      });

                    return (
                      <div key={zone} className={`drop-zone ${zone}`}>
                        <div className="zone-header">
                          {zone.charAt(0).toUpperCase() + zone.slice(1)}
                          {zoneSpaces.length > 0 && (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "normal",
                                marginLeft: "0.5rem",
                              }}
                            >
                              ({zoneSpaces.length})
                            </span>
                          )}
                        </div>
                        <div
                          className="cards-container"
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={e =>
                            handleDrop(
                              e,
                              zone,
                              formikProps.setFieldValue,
                              formikProps.values
                            )
                          }
                        >
                          {zoneSpaces.length === 0 && (
                            <div
                              style={{
                                textAlign: "center",
                                color: "#adb5bd",
                                fontSize: "0.85rem",
                                padding: "1rem",
                                fontStyle: "italic",
                              }}
                            >
                              Arrastra aquí los tipos de espacio
                            </div>
                          )}

                          {zoneSpaces.map((space, index) => {
                            // Encontrar el item del inventario correspondiente
                            const inventoryItem = formikProps.values.inventoryProductAdvertisingSpaces.find(
                              item =>
                                item.productAdvertisingSpaceId === space.id &&
                                item.zone === zone
                            );

                            return (
                              <div
                                key={`${space.id}-${zone}`}
                                className="space-card"
                                draggable
                                title={
                                  space.name.length > 15
                                    ? space.name
                                    : undefined
                                }
                                onDragStart={e =>
                                  handleDragStart(e, space, zone)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faGripVertical}
                                  className="drag-handle"
                                />
                                <span className="space-name">{space.name}</span>

                                {/* Controles para zona Interior */}
                                {zone === "interior" && inventoryItem && (
                                  <>
                                    <span className="label-inputs">
                                      Cantidad
                                    </span>{" "}
                                    <InputTextField
                                      name={`space[${index}].quantity`}
                                      showLabel={false}
                                      disabled={deleteMode}
                                      type="number"
                                      min="0"
                                      withoutFormGroup={true}
                                      customStyles={{
                                        height: "35px",
                                        width: "70px",
                                        fontSize: "12px",
                                      }}
                                    />
                                    {/* Select de ubicación de páginas */}
                                    {"      "}
                                    <span className="label-inputs">
                                      Ubicación
                                    </span>{" "}
                                    <div className="page-location-select">
                                      <InputSelectField
                                        customStyles={{
                                          control: provided => ({
                                            ...provided,
                                            minHeight: "35px",
                                            height: "35px",
                                            width: "150px",
                                            fontSize: "12px",
                                          }),
                                          valueContainer: provided => ({
                                            ...provided,
                                            height: "35px",
                                            padding: "0 6px",
                                            fontSize: "12px",
                                          }),
                                          indicatorsContainer: provided => ({
                                            ...provided,
                                            height: "35px",
                                            fontSize: "12px",
                                          }),
                                        }}
                                        showLabel={false}
                                        name={`pageLocation-${space.id}`}
                                        options={[
                                          { code: "ambas", text: "Ambas" },
                                          { code: "pares", text: "Pares" },
                                          { code: "impares", text: "Impares" },
                                        ]}
                                        getOptionLabel={option => option.text}
                                        disabled={deleteMode}
                                        onChange={e =>
                                          handlePageLocationChange(
                                            space.id,
                                            e.target.value,
                                            formikProps.setFieldValue,
                                            formikProps.values
                                          )
                                        }
                                      />
                                    </div>
                                    {/* Selección múltiple de páginas específicas */}
                                    {formikProps.values.pageCount > 2 && (
                                      <>
                                        <div className="page-selection-container">
                                          <InputMultiSelectField
                                            customStyles={{
                                              control: provided => ({
                                                ...provided,
                                                minHeight: "35px",
                                                height: "35px",
                                                width: "150px",
                                                fontSize: "12px",
                                              }),
                                              valueContainer: provided => ({
                                                ...provided,
                                                height: "35px",
                                                padding: "0 6px",
                                                fontSize: "12px",
                                              }),
                                              indicatorsContainer: provided => ({
                                                ...provided,
                                                height: "35px",
                                                fontSize: "12px",
                                              }),
                                              multiValue: provided => ({
                                                ...provided,
                                                fontSize: "12px",
                                              }),
                                              multiValueLabel: provided => ({
                                                ...provided,
                                                fontSize: "12px",
                                              }),
                                            }}
                                            name={`specificPages-${space.id}`}
                                            showLabel={false}
                                            allOptionText="Todas"
                                            placeholder="Páginas"
                                            disabled={deleteMode}
                                            options={generateInteriorPageOptions(
                                              formikProps.values.pageCount,
                                              inventoryItem.pageLocation
                                            ).map(pageNum => ({
                                              value: pageNum,
                                              text: `Pág ${pageNum}`,
                                            }))}
                                            onChangeHandler={(
                                              selectedPages,
                                              allSelected
                                            ) => {
                                              const updatedInventory = formikProps.values.inventoryProductAdvertisingSpaces.map(
                                                item => {
                                                  if (
                                                    item.productAdvertisingSpaceId ===
                                                    space.id
                                                  ) {
                                                    return {
                                                      ...item,
                                                      specificPages: selectedPages,
                                                      allPages: allSelected,
                                                    };
                                                  }
                                                  return item;
                                                }
                                              );
                                              formikProps.setFieldValue(
                                                "inventoryProductAdvertisingSpaces",
                                                updatedInventory
                                              );
                                            }}
                                            onAllChangeHandler={allSelected => {
                                              handleAllPagesChange(
                                                space.id,
                                                allSelected,
                                                formikProps.setFieldValue,
                                                formikProps.values
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}

                                {/* <span className="quantity-badge">
                                  {space.quantity || 0}
                                </span> */}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        />
      </FormFieldset>
    </InventoryContainer>
  );
};

export default InventorySpacesSection;
