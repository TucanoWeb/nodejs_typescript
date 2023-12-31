CREATE TABLE VOOS
(COD_VOO NUMBER(9) CONSTRAINT PK_COD_VOO PRIMARY KEY,
DATA_VOO DATE,
HORA_VOO NUMBER(5),
TIPO_VOO VARCHAR2(15),
TRECHO_VOO VARCHAR2(30));

CREATE TABLE AVIOES
(ID_AV VARCHAR2(6) CONSTRAINT PK_ID_AV PRIMARY KEY,
ANO_AV NUMBER(4),
MODELO_AV VARCHAR2(10),
MAPA_ASSENTOS_AV VARCHAR2(3),
NUM_ASSENTOS_AV NUMBER(3));

CREATE TABLE AEROPORTOS
(COD_AERO VARCHAR2(3) CONSTRAINT PK_COD_AERO PRIMARY KEY,
NOME_AERO VARCHAR2(50),
PAIS_AERO VARCHAR2(15),
CIDADE_AERO VARCHAR2(30),
FK_VOOS_COD_VOO NUMBER(9),
FK_AVIOES_ID_AV VARCHAR2(6),
FOREIGN KEY(FK_AVIOES_ID_AV)REFERENCES AVIOES (ID_AV),
FOREIGN KEY (FK_VOOS_COD_VOO)REFERENCES VOOS (COD_VOO));

CREATE TABLE PASSAGEM
(COD_PASS NUMBER(9) CONSTRAINT PK_COD_PASS PRIMARY KEY,
TIPO_PASS VARCHAR2(15),
COD_ASSENTOS NUMBER(3),
FK_VOOS_COD_VOO NUMBER(9),
FK_AVIOES_ID_AV VARCHAR2(6),
FK_AEROPORTOS_COD_AERO VARCHAR2(3),
FOREIGN KEY (FK_AVIOES_ID_AV)REFERENCES AVIOES (ID_AV),
FOREIGN KEY (FK_VOOS_COD_VOO)REFERENCES VOOS (COD_VOO),
FOREIGN KEY (FK_AEROPORTOS_COD_AERO)REFERENCES AEROPORTOS(COD_AERO));

CREATE TABLE DADOS_PAG
(COD_PAG NUMBER(9) CONSTRAINT PK_COD_PAG PRIMARY KEY,
ID_COMP VARCHAR2(14),
PASS_PAG VARCHAR2(15),
VALOR_PAG NUMBER(6),
EMAIL_PAG VARCHAR2(256),
FK_PASSAGEM_COD_PASS NUMBER(9),
FOREIGN KEY (FK_PASSAGEM_COD_PASS)REFERENCES PASSAGEM (COD_PASS));

-- INSERTS

-- Inserindo 40 exemplos na tabela VOOS
DECLARE
    TYPE array_t IS VARRAY(20) OF VARCHAR2(10);
    array array_t := array_t('GRU', 'CNF', 'GIG', 'BSB', 'CGH', 'SSA', 'REC', 'POA', 'FOR', 'CWB', 'MAO', 'BEL', 'FLN', 'SSZ', 'VCP', 'AJU', 'BPS', 'CGB', 'GYN', 'IOS');
BEGIN
    FOR i IN 1..20 LOOP
        INSERT INTO VOOS (COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO)
        VALUES (i, TO_DATE('2023-10-01', 'YYYY-MM-DD'), 1200 + i, 'Doméstico', array(i) || ' -> ' || array(MOD(i + 1, 20) + 1));

        INSERT INTO VOOS (COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO)
        VALUES (i + 20, TO_DATE('2023-10-01', 'YYYY-MM-DD'), 1400 + (i + 20), 'Doméstico', array(MOD(i + 1, 20) + 1) || ' -> ' || array(i));
    END LOOP;
    COMMIT;
END;


-- Inserindo 10 exemplos na tabela AVIOES
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO AVIOES (ID_AV, ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV)
        VALUES ('BOE' || i, 2010 + i, 'Modelo ' || i, 'ABC', 150);
    END LOOP;
    COMMIT;
END;

-- Inserindo os 20 aeroportos vinculados aos voos e aviões
INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('GRU', 'Aeroporto Internacional de Guarulhos', 'Brasil', 'São Paulo', 1, 'BOE1');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('CNF', 'Aeroporto Internacional de Confins', 'Brasil', 'Belo Horizonte', 2, 'BOE2');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('GIG', 'Aeroporto Internacional do Rio de Janeiro', 'Brasil', 'Rio de Janeiro', 3, 'BOE3');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('BSB', 'Aeroporto Internacional de Brasília', 'Brasil', 'Brasília', 4, 'BOE4');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('CGH', 'Aeroporto de Congonhas', 'Brasil', 'São Paulo', 5, 'BOE5');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('SSA', 'Aeroporto Internacional de Salvador', 'Brasil', 'Salvador', 6, 'BOE6');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('REC', 'Aeroporto Internacional do Recife', 'Brasil', 'Recife', 7, 'BOE7');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('POA', 'Aeroporto Internacional Salgado Filho', 'Brasil', 'Porto Alegre', 8, 'BOE8');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('FOR', 'Aeroporto Internacional de Fortaleza', 'Brasil', 'Fortaleza', 9, 'BOE9');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('CWB', 'Aeroporto Internacional Afonso Pena', 'Brasil', 'Curitiba', 10, 'BOE10');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('MAO', 'Aeroporto Internacional Eduardo Gomes', 'Brasil', 'Manaus', 11, 'BOE1');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('BEL', 'Aeroporto Internacional de Belém', 'Brasil', 'Belém', 12, 'BOE2');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('FLN', 'Aeroporto Internacional Hercílio Luz', 'Brasil', 'Florianópolis', 13, 'BOE3');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('SSZ', 'Aeroporto Santos Dumont', 'Brasil', 'Rio de Janeiro', 14, 'BOE4');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('VCP', 'Aeroporto Internacional de Viracopos', 'Brasil', 'Campinas', 15, 'BOE5');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('AJU', 'Aeroporto de Aracaju', 'Brasil', 'Aracaju', 16, 'BOE6');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('BPS', 'Aeroporto de Porto Seguro', 'Brasil', 'Porto Seguro', 17, 'BOE7');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('CGB', 'Aeroporto Internacional Marechal Rondon', 'Brasil', 'Cuiabá', 18, 'BOE8');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('GYN', 'Aeroporto de Goiânia - Santa Genoveva', 'Brasil', 'Goiânia', 19, 'BOE9');

INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV)
VALUES ('IOS', 'Aeroporto de Ilhéus - Jorge Amado', 'Brasil', 'Ilhéus', 20, 'BOE10');


-- Inserindo 10 exemplos na tabela PASSAGEM
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO PASSAGEM (COD_PASS, TIPO_PASS, COD_ASSENTOS, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV, FK_AEROPORTOS_COD_AERO)
        VALUES (i, 'Econômico', i, i, 'BOE' || i, CASE
                                                        WHEN i <= 5 THEN 'GRU'
                                                        ELSE 'CNF'
                                                    END);
    END LOOP;
    COMMIT;
END;


-- Inserindo 10 exemplos na tabela DADOS_PAG
DECLARE
    v_cpf VARCHAR2(11);
    v_cnpj VARCHAR2(14);
BEGIN
    FOR i IN 1..5 LOOP
        -- Gerando CPF
        v_cpf := '';
        FOR j IN 1..11 LOOP
            v_cpf := v_cpf || TRUNC(DBMS_RANDOM.VALUE(0, 9));
        END LOOP;
        
        -- Inserindo CPF na tabela DADOS_PAG
        INSERT INTO DADOS_PAG (COD_PAG, ID_COMP, PASS_PAG, VALOR_PAG, EMAIL_PAG, FK_PASSAGEM_COD_PASS)
        VALUES (i, v_cpf, 'Cartao' || i, 100 * i, 'exemplo' || i || '@email.com', i);
    END LOOP;
    
    FOR i IN 6..10 LOOP
        -- Gerando CNPJ
        v_cnpj := '';
        FOR k IN 1..14 LOOP
            v_cnpj := v_cnpj || TRUNC(DBMS_RANDOM.VALUE(0, 9));
        END LOOP;
        
        -- Inserindo CNPJ na tabela DADOS_PAG
        INSERT INTO DADOS_PAG (COD_PAG, ID_COMP, PASS_PAG, VALOR_PAG, EMAIL_PAG, FK_PASSAGEM_COD_PASS)
        VALUES (i, v_cnpj, 'Cartao' || i, 100 * i, 'exemplo' || i || '@email.com', i);
    END LOOP;
    
    COMMIT;
END;







