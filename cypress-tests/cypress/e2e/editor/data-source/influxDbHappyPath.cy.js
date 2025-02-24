import { postgreSqlSelector } from "Selectors/postgreSql";
import { postgreSqlText } from "Texts/postgreSql";
import { commonWidgetText, commonText } from "Texts/common";
import { commonSelectors, commonWidgetSelector } from "Selectors/common";
import {
  addQuery,
  fillDataSourceTextField,
  fillConnectionForm,
  selectDataSource,
  openQueryEditor,
  selectQueryMode,
  addGuiQuery,
  addWidgetsToAddUser,
} from "Support/utils/postgreSql";
import { verifyCouldnotConnectWithAlert,deleteDatasource,closeDSModal } from "Support/utils/dataSource";

describe("Data sources", () => {
  beforeEach(() => {
    cy.appUILogin();
  });

  it("Should verify elements on connection form", () => {
    cy.get(commonSelectors.globalDataSourceIcon).click();
    closeDSModal();
    cy.get(commonSelectors.addNewDataSourceButton)
      .verifyVisibleElement("have.text", commonText.addNewDataSourceButton)
      .click();

    cy.get(postgreSqlSelector.allDatasourceLabelAndCount).should(
      "have.text",
      postgreSqlText.allDataSources
    );
    cy.get(postgreSqlSelector.databaseLabelAndCount).should(
      "have.text",
      postgreSqlText.allDatabase
    );
    cy.get(postgreSqlSelector.apiLabelAndCount).should(
      "have.text",
      postgreSqlText.allApis
    );
    cy.get(postgreSqlSelector.cloudStorageLabelAndCount).should(
      "have.text",
      postgreSqlText.allCloudStorage
    );

    cy.get(postgreSqlSelector.dataSourceSearchInputField).type("InfluxDB");
    cy.get("[data-cy*='data-source-']").eq(1).should("contain", "InfluxDB");
    cy.get('[data-cy="data-source-influxdb"]').click();

    cy.get(postgreSqlSelector.dataSourceNameInputField).should(
      "have.value",
      "InfluxDB"
    );
    cy.get('[data-cy="label-api-token"]').verifyVisibleElement(
      "have.text",
      "API token"
    );
    cy.get(postgreSqlSelector.labelHost).verifyVisibleElement(
      "have.text",
      postgreSqlText.labelHost
    );
    cy.get(postgreSqlSelector.labelPort).verifyVisibleElement(
      "have.text",
      postgreSqlText.labelPort
    );
    cy.get('[data-cy="label-protocol"]').verifyVisibleElement(
      "have.text",
      "Protocol"
    );
    cy.get(postgreSqlSelector.labelIpWhitelist).verifyVisibleElement(
      "have.text",
      postgreSqlText.whiteListIpText
    );
    cy.get(postgreSqlSelector.buttonCopyIp).verifyVisibleElement(
      "have.text",
      postgreSqlText.textCopy
    );

    cy.get(postgreSqlSelector.linkReadDocumentation).verifyVisibleElement(
      "have.text",
      postgreSqlText.readDocumentation
    );
    cy.get(postgreSqlSelector.buttonTestConnection)
      .verifyVisibleElement(
        "have.text",
        postgreSqlText.buttonTextTestConnection
      )
      .click();
    cy.get(postgreSqlSelector.connectionFailedText).verifyVisibleElement(
      "have.text",
      postgreSqlText.couldNotConnect
    );
    cy.get(postgreSqlSelector.buttonSave).verifyVisibleElement(
      "have.text",
      postgreSqlText.buttonTextSave
    );
    cy.get('[data-cy="connection-alert-text"]').verifyVisibleElement(
      "have.text",
      "Invalid URL"
    );
  });

  it("Should verify the functionality of PostgreSQL connection form.", () => {
    selectDataSource("InfluxDB");

    cy.clearAndType(
      '[data-cy="data-source-name-input-filed"]',
      "cypress-influxdb"
    );

    cy.clearAndType('[data-cy="api-token-text-field"]',
      Cypress.env("influxdb_token")
    );

    fillDataSourceTextField(
      postgreSqlText.labelHost,
      "",
      Cypress.env("influxdb_host")
    );
    fillDataSourceTextField(postgreSqlText.labelPort, "8086 ", "8086");
    cy.get(".react-select__input-container")
      .click()
      .type("HTTP{enter}");

    cy.get(postgreSqlSelector.buttonTestConnection).click();
    cy.get(postgreSqlSelector.textConnectionVerified, {
      timeout: 10000,
    }).should("have.text", postgreSqlText.labelConnectionVerified);
    cy.get(postgreSqlSelector.buttonSave).click();

    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      postgreSqlText.toastDSAdded
    );

      cy.get('[data-cy="cypress-influxdb-button"]').verifyVisibleElement(
        "have.text",
        "cypress-influxdb"
      );
  
      deleteDatasource("cypress-influxdb");
  });
});
