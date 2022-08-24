const Ticket = require("./Ticket");
const { readFile, writeFile } = require("./utils");

const tickets = Symbol("tickets");

class TicketCollection {
  constructor() {
    (async () => {
      this[tickets] = await readFile();
    }).call(this);
  }

  /**
   * Create and save a new ticket.
   * @param {string} username
   * @param {number} price
   * @returns {Ticket}
   */
  create(username, price) {
    const ticket = new Ticket(username, price);
    this[tickets].push(ticket);
    writeFile(this[tickets]);
    return ticket;
  }

  /**
   * Returns all tickets
   * @returns
   */
  find() {
    return this[tickets];
  }

  /**
   * Find a single ticket by id.
   * @param {string} id
   * @returns {Ticket}
   */
  findById(id) {
    const ticket = this[tickets].find(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => ticket.id === id
    );
    return ticket;
  }

  /**
   * Find tickets by username
   * @param {string} username
   * @returns {Ticket[]}
   */
  findByUsername(username) {
    const userTickets = this[tickets].filter(
      /**
       * @param {Ticket}
       */
      (ticket) => ticket.username === username
    );
    return userTickets;
  }

  /**
   * Update ticket by id
   * @param {string} ticketId
   * @param {{username: string, price: number}} ticketBody
   * @returns {Ticket}
   */
  updateById(ticketId, ticketBody) {
    const ticket = this.findById(ticketId);
    if (ticket) {
      ticket.username = ticketBody.username ?? ticket.username;
      ticket.price = ticketBody.price ?? ticket.price;
    }
    writeFile(this[tickets]);
    return ticket;
  }

  /**
   * Delete ticket by Id
   * @param {string} ticketId
   * @returns {boolean}
   */
  async deleteById(ticketId) {
    const index = this[tickets].findIndex(
      /**
       *
       * @param {Ticket} ticket
       * @returns {number}
       */
      (ticket) => ticket.id === ticketId
    );

    if (index === -1) {
      return false;
    } else {
      this[tickets].splice(index, 1);
      await writeFile(this[tickets]);
      return true;
    }
  }
  /**
   * Create bulk tickets
   * @param {string} username
   * @param {number} price
   * @param {number} quantity
   */
  createBulk(username, price, quantity) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = this.create(username, price);
      result.push(ticket);
    }
    this[tickets].concat(result);
    writeFile(this[tickets]);
    return result;
  }

  /**
   * Bulk ticket update by username
   * @param {string} username
   * @param {{username: string, price: number}} ticketBody
   */
  updateBulk(username, ticketBody) {
    const userTickets = this.findByUsername(username);
    if (userTickets) {
      const updatedTickets = userTickets.map(
        /**
         * @param {Ticket} ticket
         */
        (ticket) => this.updateById(username, ticketBody)
      );
    }
    writeFile(this[tickets]);
    return updatedTickets;
  }

  /**
   * Bulk delete by username
   * @param {string} username
   */
  deleteBulk(username) {
    const userTickets = this.findByUsername(username);
    const deletedResult = userTickets.map(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => {
        const index = this[tickets].findIndex((item) => ticket.id === item.id);

        if (index === -1) {
        } else {
          this[tickets].splice(index, 1);
          // await writeFile(this[tickets]);
        }
      }
    );
    writeFile(this[tickets]);
    return deletedResult;
  }

  /**
   * Find winner list
   * @param {number} winnerCount
   */
  draw(winnerCount) {
    const winnerIndexes = new Array(winnerCount);
    let winnerIndex = 0;
    while (winnerIndex < winnerCount) {
      let ticketIndex = Math.floor(Math.random() * this[tickets].length);
      if (!winnerIndexes.includes(ticketIndex)) {
        winnerIndexes[winnerIndex++] = ticketIndex;
        continue;
      }
    }
    const winners = winnerIndexes.map(
      /**
       * @param {number} index
       */
      (index) => this[tickets][index]
    );
    return winners;
  }
}

const collection = new TicketCollection();
module.exports = collection;
