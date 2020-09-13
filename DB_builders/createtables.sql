CREATE TABLE USR
(
  ID            INT           NOT NULL    PRIMARY KEY,
  Name          VARCHAR(40)   NOT NULL,
  Password      VARCHAR(32)   NOT NULL
);

CREATE TABLE ADMIN
(
  USRID         INT           NOT NULL,
  Role          VARCHAR(16)   NOT NULL,
  CONSTRAINT ADMIN_FK
    FOREIGN KEY(USRID) REFERENCES USR(ID)
);

CREATE TABLE SPONSOR
(
  ID            INT           NOT NULL    PRIMARY KEY,
  Name VARCHAR(40) NOT NULL
);

CREATE TABLE SPONSOR_MGR
(
  USRID         INT           NOT NULL,
  Role          VARCHAR(16)   NOT NULL,
  SponsorID     INT           NOT NULL,
  CONSTRAINT SPONSOR_MGR_FK
    FOREIGN KEY(USRID) REFERENCES USR(ID),
  CONSTRAINT SPONSOR_MGR_SPONSOR_FK
    FOREIGN KEY(SponsorID) REFERENCES SPONSOR(ID)
);

CREATE TABLE DRIVER
(
  USRID         INT           NOT NULL,
  Role          VARCHAR(16)   NOT NULL,
  StartDate     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  Status        VARCHAR(16)   NOT NULL,
  SponsorID     INT           NOT NULL,
  CONSTRAINT DRIVER_FK
    FOREIGN KEY(USRID) REFERENCES USR(ID)
    ON UPDATE CASCADE,
  CONSTRAINT DRIVER_SPONSOR_FK
    FOREIGN KEY(SponsorID) REFERENCES SPONSOR(ID)
);

CREATE TABLE EVENT
(
  ID            INT           NOT NULL    PRIMARY KEY,
  USRID         INT           NOT NULL,
  EventDate     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  Description   VARCHAR(120)  NOT NULL,
  Points        INT           NOT NULL,
  CONSTRAINT EVENT_FK
    FOREIGN KEY(USRID) REFERENCES USR(ID)
);

CREATE TABLE ANNOUNCEMENT
(
  ID            INT           NOT NULL    PRIMARY KEY,
  AnncDate      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  Content       VARCHAR(120)  NOT NULL,
  SponsorMgrID  INT           NOT NULL,
  CONSTRAINT ANNOUNCEMENT_FK
    FOREIGN KEY(SponsorMgrID) REFERENCES USR(ID)
);

CREATE TABLE THREAD
(
  ID            INT           NOT NULL    PRIMARY KEY,
  SenderID      INT           NOT NULL,
  RecipientID   INT           NOT NULL
);

CREATE TABLE MESSAGE
(
  ID              INT             NOT NULL    PRIMARY KEY,
  ThreadID        INT             NOT NULL,
  MessageDate     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  Subject         VARCHAR(120)    NOT NULL,
  Content         VARCHAR(1000)   NOT NULL,
  CONSTRAINT THREADID_PK
    FOREIGN KEY(ThreadID) REFERENCES THREAD(ID)
);

CREATE TABLE CATALOG
(
  ID              INT             NOT NULL    PRIMARY KEY,
  Name            VARCHAR(40)     NOT NULL,
  Supplier        VARCHAR(40)     NOT NULL,
  SponsorMgrID    INT             NOT NULL,
  CONSTRAINT CATALOG_SPONSOR_MGR_FK
    FOREIGN KEY(SponsorMgrID) REFERENCES USR(ID)
);

CREATE TABLE CATALOG_ITEM
(
  ID              INT             NOT NULL    PRIMARY KEY,
  Name            VARCHAR(50)     NOT NULL,
  Description     VARCHAR(240)    NOT NULL,
  ImageLink       VARCHAR(512)    NOT NULL,
  PointsCost      INT             NOT NULL,
  ActualCost      MONEY           NOT NULL
);

CREATE TABLE ORDR
(
  ID              INT             NOT NULL    PRIMARY KEY,
  DriverID        INT             NOT NULL,
  ORDRDate        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  Status          VARCHAR(16)     NOT NULL,
  CONSTRAINT ORDR_DRIVERID_FK
    FOREIGN KEY(DriverID) REFERENCES USR(ID)
);

CREATE TABLE ORDR_ITEM
(
  ID              INT             NOT NULL    PRIMARY KEY,
  ORDRID          INT             NOT NULL,
  CatalogID       INT             NOT NULL,
  ItemID          INT             NOT NULL,
  Quantity        INT             NOT NULL,
  PointsCost      INT             NOT NULL,
  ActualCost      MONEY           NOT NULL,
  CONSTRAINT ORDR_ITEM_ORDRID_FK
    FOREIGN KEY(ORDRID) REFERENCES ORDR(ID)
);

CREATE TABLE CONTAINS_ITEM
(
    CatalogID     INT           NOT NULL,
    ItemID        INT           NOT NULL,
    CONSTRAINT CATALOGID_FK
      FOREIGN KEY(CatalogID) REFERENCES CATALOG(ID),
    CONSTRAINT ITEM_FK
      FOREIGN KEY(ItemID) REFERENCES CATALOG_ITEM(ID)
);
