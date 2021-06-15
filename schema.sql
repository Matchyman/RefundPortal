CREATE TABLE refunds(
    -- @TODO finshm creating schema
    title varChar(10),
    first_name varChar(50) NOT NULL,
    last_name varChar(50) NOT NULL,
    student_number char(7) NOT NULL,
    
    int_accept boolean,
    int_accept_date date,
    fi_accept boolean,
    fi_accept_date date,
);